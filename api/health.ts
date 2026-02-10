import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/postgres';
import { createClient as createKVClient } from '@vercel/kv';
import { HEALTH_CONFIG } from './lib/health-config.js';

interface HealthCheck {
  name: string;
  status: 'healthy' | 'degraded' | 'unhealthy';
  latency_ms: number;
  message: string;
  critical: boolean;
}

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
  // If no token configured, fail closed.
  const configuredToken = process.env.HEALTH_CHECK_TOKEN;

  if (!configuredToken || !authHeader || authHeader !== `Bearer ${configuredToken}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const startTime = Date.now();

  // Execute checks in parallel
  const checks: HealthCheck[] = await Promise.all([
    checkPostgres(),
    checkRedis(),
    checkOpenAI(),
    checkMercadoPago(),
    checkAuth0(),
    checkPrivy(),
    checkGoogleAPIs(),
    checkVercelAPI(),
  ]);

  // Calculate global status
  const healthyCount = checks.filter(c => c.status === 'healthy').length;
  const criticalHealthy = checks.filter(c => c.critical && c.status === 'healthy').length;
  const totalCritical = checks.filter(c => c.critical).length;

  const globalStatus = criticalHealthy === totalCritical ? 'healthy' :
                       criticalHealthy >= totalCritical - 1 ? 'degraded' : 'unhealthy';

  res.status(200).json({
    globalStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    totalLatency_ms: Date.now() - startTime,
    results: checks,
    summary: {
      healthy: checks.filter(c => c.status === 'healthy').length,
      degraded: checks.filter(c => c.status === 'degraded').length,
      unhealthy: checks.filter(c => c.status === 'unhealthy').length,
    },
  });
}

// Helper for timeout
const fetchWithTimeout = async (url: string, options: RequestInit = {}, timeoutMs: number = 3000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

// Postgres Check
async function checkPostgres(): Promise<HealthCheck> {
  const config = HEALTH_CONFIG.postgres;
  if (!config.enabled) return createDisabledCheck(config);

  const start = Date.now();
  try {
    // If no POSTGRES_URL is set, fail fast but check if it's critical
    if (!process.env.POSTGRES_URL) {
       throw new Error('POSTGRES_URL not configured');
    }

    const client = createClient();
    await client.connect();
    await client.sql`SELECT 1 as healthy`;
    await client.end(); // Close connection
    const latency = Date.now() - start;

    return {
      name: config.name,
      status: latency < config.thresholds.healthy ? 'healthy' : latency < config.thresholds.degraded ? 'degraded' : 'unhealthy',
      latency_ms: latency,
      message: `Conectado - ${latency}ms`,
      critical: config.critical,
    };
  } catch (error: any) {
    return {
      name: config.name,
      status: 'unhealthy',
      latency_ms: Date.now() - start,
      message: error.message || 'Connection failed',
      critical: config.critical,
    };
  }
}

// Redis Check (Vercel KV)
async function checkRedis(): Promise<HealthCheck> {
  const config = HEALTH_CONFIG.redis;
  if (!config.enabled) return createDisabledCheck(config);

  const start = Date.now();
  try {
    const kvUrl = process.env.KV_REST_API_URL;
    const kvToken = process.env.KV_REST_API_TOKEN;

    if (!kvUrl || !kvToken) {
        throw new Error('KV_REST_API_URL or KV_REST_API_TOKEN not set');
    }

    const kv = createKVClient({
      url: kvUrl,
      token: kvToken,
    });

    // Use a unique key for health check to avoid collisions
    const key = `health_check_${Date.now()}`;
    await kv.set(key, 'ok', { ex: 10 });
    await kv.get(key);

    const latency = Date.now() - start;
    return {
      name: config.name,
      status: latency < config.thresholds.healthy ? 'healthy' : latency < config.thresholds.degraded ? 'degraded' : 'unhealthy',
      latency_ms: latency,
      message: `Operacional - ${latency}ms`,
      critical: config.critical,
    };
  } catch (error: any) {
    return {
      name: config.name,
      status: 'unhealthy',
      latency_ms: Date.now() - start,
      message: error.message || 'Redis failed',
      critical: config.critical,
    };
  }
}

// OpenAI Check
async function checkOpenAI(): Promise<HealthCheck> {
  const config = HEALTH_CONFIG.openai;
  if (!config.enabled) return createDisabledCheck(config);

  const start = Date.now();
  try {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
    }

    const response = await fetchWithTimeout('https://api.openai.com/v1/models', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    }, config.timeout);

    const latency = Date.now() - start;
    return {
      name: config.name,
      status: response.ok && latency < config.thresholds.healthy ? 'healthy' : latency < config.thresholds.degraded ? 'degraded' : 'unhealthy',
      latency_ms: latency,
      message: `Status ${response.status} - ${latency}ms`,
      critical: config.critical,
    };
  } catch (error: any) {
    return {
      name: config.name,
      status: 'unhealthy',
      latency_ms: Date.now() - start,
      message: error.message || 'OpenAI check failed',
      critical: config.critical,
    };
  }
}

// MercadoPago Check
async function checkMercadoPago(): Promise<HealthCheck> {
  const config = HEALTH_CONFIG.mercadopago;
  if (!config.enabled) return createDisabledCheck(config);

  const start = Date.now();
  try {
    if (!process.env.MERCADOPAGO_ACCESS_TOKEN) {
         throw new Error('MERCADOPAGO_ACCESS_TOKEN not configured');
    }

    const response = await fetchWithTimeout('https://api.mercadopago.com/v1/payment_methods', {
      headers: {
        'Authorization': `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
      },
    }, config.timeout);

    const latency = Date.now() - start;
    return {
      name: config.name,
      status: response.ok && latency < config.thresholds.healthy ? 'healthy' : latency < config.thresholds.degraded ? 'degraded' : 'unhealthy',
      latency_ms: latency,
      message: `Status ${response.status}`,
      critical: config.critical,
    };
  } catch (error: any) {
    return {
      name: config.name,
      status: 'unhealthy',
      latency_ms: Date.now() - start,
      message: error.message || 'MercadoPago check failed',
      critical: config.critical,
    };
  }
}

// Auth0 Check
async function checkAuth0(): Promise<HealthCheck> {
  const config = HEALTH_CONFIG.auth0;
  if (!config.enabled) return createDisabledCheck(config);

  const start = Date.now();
  try {
    const domain = process.env.VITE_AUTH0_DOMAIN;
    if (!domain) {
         // Not critical if not configured, maybe just return healthy/disabled
         throw new Error('VITE_AUTH0_DOMAIN not configured');
    }

    const response = await fetchWithTimeout(`https://${domain}/.well-known/jwks.json`, {}, config.timeout);

    const latency = Date.now() - start;
    return {
      name: config.name,
      status: response.ok ? 'healthy' : 'degraded',
      latency_ms: latency,
      message: `JWKS acessível`,
      critical: config.critical,
    };
  } catch (error: any) {
    return {
      name: config.name,
      status: 'unhealthy',
      latency_ms: Date.now() - start,
      message: error.message || 'Auth0 check failed',
      critical: config.critical,
    };
  }
}

// Privy Check
async function checkPrivy(): Promise<HealthCheck> {
  const config = HEALTH_CONFIG.privy;
  if (!config.enabled) return createDisabledCheck(config);

  const start = Date.now();
  try {
    const response = await fetchWithTimeout('https://auth.privy.io/api/v1/health', {}, config.timeout);

    const latency = Date.now() - start;
    return {
      name: config.name,
      status: response.ok ? 'healthy' : 'degraded',
      latency_ms: latency,
      message: `Status ${response.status}`,
      critical: config.critical,
    };
  } catch (error: any) {
    return {
      name: config.name,
      status: 'unhealthy',
      latency_ms: Date.now() - start,
      message: error.message || 'Privy check failed',
      critical: config.critical,
    };
  }
}

// Google APIs Check
async function checkGoogleAPIs(): Promise<HealthCheck> {
  const config = HEALTH_CONFIG.google_apis;
  if (!config.enabled) return createDisabledCheck(config);

  const start = Date.now();
  try {
    const response = await fetchWithTimeout('https://www.googleapis.com/discovery/v1/apis', {}, config.timeout);

    const latency = Date.now() - start;
    return {
      name: config.name,
      status: response.ok ? 'healthy' : 'degraded',
      latency_ms: latency,
      message: `Discovery API OK`,
      critical: config.critical,
    };
  } catch (error: any) {
    return {
      name: config.name,
      status: 'unhealthy',
      latency_ms: Date.now() - start,
      message: error.message || 'Google API check failed',
      critical: config.critical,
    };
  }
}

// Vercel API Check (self-check)
async function checkVercelAPI(): Promise<HealthCheck> {
  const config = HEALTH_CONFIG.vercel_api || { name: 'Vercel API', critical: true };

  const start = Date.now();
  // Since this code is running inside the Vercel Function, it implies the compute is working.
  const latency = Date.now() - start;
  return {
    name: config.name,
    status: 'healthy',
    latency_ms: latency,
    message: 'Serverless function operacional',
    critical: config.critical,
  };
}

function createDisabledCheck(config: any): HealthCheck {
    return {
        name: config.name,
        status: 'healthy', // Disabled checks are considered healthy so they don't alarm
        latency_ms: 0,
        message: 'Disabled',
        critical: config.critical
    };
}
