import { kv } from './kv.js';

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

const DEFAULT_HEALTH_CONFIG: Record<string, ServiceConfig> = {
  postgres: {
    name: 'PostgreSQL (Vercel)',
    enabled: true,
    critical: true,
    timeout: 5000,
    thresholds: { healthy: 100, degraded: 500 },
  },
  openai: {
    name: 'OpenAI API',
    enabled: true,
    critical: false,
    timeout: 3000,
    thresholds: { healthy: 1000, degraded: 2000 },
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

const CONFIG_KEY = 'health:config';

export async function getHealthConfig(): Promise<Record<string, ServiceConfig>> {
  try {
    const config = await kv.get<Record<string, ServiceConfig>>(CONFIG_KEY);
    if (config && Object.keys(config).length > 0) {
      // Merge with default config to ensure new keys exist if schema changes
      return { ...DEFAULT_HEALTH_CONFIG, ...config };
    }

    // If no config found, initialize with defaults
    console.log('Initializing Health Config in KV');
    await kv.set(CONFIG_KEY, DEFAULT_HEALTH_CONFIG);
    return { ...DEFAULT_HEALTH_CONFIG };
  } catch (error) {
    console.error('Failed to fetch health config from KV:', error);
    return { ...DEFAULT_HEALTH_CONFIG };
  }
}

export async function updateServiceConfig(
  serviceName: string,
  updates: Partial<ServiceConfig>
): Promise<ServiceConfig | null> {
  try {
    const currentConfig = await getHealthConfig();

    if (!currentConfig[serviceName]) {
      return null;
    }

    const updatedServiceConfig = {
      ...currentConfig[serviceName],
      ...updates
    };

    currentConfig[serviceName] = updatedServiceConfig;

    await kv.set(CONFIG_KEY, currentConfig);

    return updatedServiceConfig;
  } catch (error) {
    console.error(`Failed to update service config for ${serviceName}:`, error);
    throw error;
  }
}
