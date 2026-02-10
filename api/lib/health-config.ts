export interface ServiceConfig {
  name: string;
  enabled: boolean;
  critical: boolean;
  timeout: number;
  thresholds: {
    healthy: number;
    degraded: number;
  };
}

export const HEALTH_CONFIG: Record<string, ServiceConfig> = {
  postgres: {
    name: 'PostgreSQL (Vercel)',
    enabled: true,
    critical: true,
    timeout: 5000,
    thresholds: { healthy: 100, degraded: 500 },
  },
  redis: {
    name: 'Redis (Vercel KV)',
    enabled: true,
    critical: true,
    timeout: 3000,
    thresholds: { healthy: 50, degraded: 200 },
  },
  openai: {
    name: 'OpenAI API',
    enabled: true,
    critical: false,
    timeout: 3000,
    thresholds: { healthy: 1000, degraded: 2000 },
  },
  mercadopago: {
    name: 'MercadoPago',
    enabled: true,
    critical: false,
    timeout: 3000,
    thresholds: { healthy: 500, degraded: 1000 },
  },
  auth0: {
    name: 'Auth0',
    enabled: true,
    critical: false,
    timeout: 2000,
    thresholds: { healthy: 300, degraded: 800 },
  },
  privy: {
    name: 'Privy Auth',
    enabled: true,
    critical: false,
    timeout: 2000,
    thresholds: { healthy: 300, degraded: 800 },
  },
  google_apis: {
    name: 'Google APIs',
    enabled: true,
    critical: false,
    timeout: 2000,
    thresholds: { healthy: 400, degraded: 1000 },
  },
  vercel_api: {
    name: 'Vercel API',
    enabled: true,
    critical: true,
    timeout: 1000,
    thresholds: { healthy: 100, degraded: 300 },
  }
};

// Function to dynamically toggle service checks
export function toggleService(serviceName: string, enabled: boolean) {
  if (HEALTH_CONFIG[serviceName]) {
    HEALTH_CONFIG[serviceName].enabled = enabled;
  }
}

// Function to update thresholds
export function updateThresholds(
  serviceName: string,
  thresholds: { healthy: number; degraded: number }
) {
  if (HEALTH_CONFIG[serviceName]) {
    HEALTH_CONFIG[serviceName].thresholds = thresholds;
  }
}
