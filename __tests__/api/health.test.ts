import handler from '../../api/health';

// Mock dependencies
jest.mock('@vercel/postgres', () => ({
  createClient: jest.fn(() => ({
    connect: jest.fn().mockResolvedValue(undefined),
    sql: jest.fn().mockResolvedValue({ rows: [{ healthy: 1 }] }),
    end: jest.fn().mockResolvedValue(undefined),
  })),
}));

jest.mock('@vercel/kv', () => ({
  createClient: jest.fn(() => ({
    set: jest.fn().mockResolvedValue('OK'),
    get: jest.fn().mockResolvedValue('ok'),
  })),
}));

// Mock configuration service
jest.mock('../../api/lib/health-config', () => ({
  getHealthConfig: jest.fn().mockResolvedValue({
      postgres: { name: 'PostgreSQL (Vercel)', enabled: true, critical: true, timeout: 5000, thresholds: { healthy: 100, degraded: 500 } },
      redis: { name: 'Redis (Vercel KV)', enabled: true, critical: true, timeout: 3000, thresholds: { healthy: 50, degraded: 200 } },
      openai: { name: 'OpenAI API', enabled: true, critical: false, timeout: 3000, thresholds: { healthy: 1000, degraded: 2000 } },
      mercadopago: { name: 'MercadoPago', enabled: true, critical: false, timeout: 3000, thresholds: { healthy: 500, degraded: 1000 } },
      auth0: { name: 'Auth0', enabled: true, critical: false, timeout: 2000, thresholds: { healthy: 300, degraded: 800 } },
      privy: { name: 'Privy Auth', enabled: true, critical: false, timeout: 2000, thresholds: { healthy: 300, degraded: 800 } },
      google_apis: { name: 'Google APIs', enabled: true, critical: false, timeout: 2000, thresholds: { healthy: 400, degraded: 1000 } },
      vercel_api: { name: 'Vercel API', enabled: true, critical: true, timeout: 1000, thresholds: { healthy: 100, degraded: 300 } }
  }),
}));


// Mock fetch
const fetchMock = jest.fn();
global.fetch = fetchMock;

// Mock environment variables
const originalEnv = process.env;

describe('Health Check API', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks(); // Use clearAllMocks instead of resetModules to keep mocks
    process.env = { ...originalEnv };
    process.env.HEALTH_CHECK_TOKEN = 'test-token';
    process.env.POSTGRES_URL = 'postgres://test';
    process.env.KV_REST_API_URL = 'https://test-kv';
    process.env.KV_REST_API_TOKEN = 'test-kv-token';
    process.env.OPENAI_API_KEY = 'test-openai';
    process.env.MERCADOPAGO_ACCESS_TOKEN = 'test-mp';
    process.env.VITE_AUTH0_DOMAIN = 'test.auth0.com';

    req = {
      method: 'GET',
      headers: {
        authorization: 'Bearer test-token',
      },
    };

    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };

    fetchMock.mockReset();
    fetchMock.mockResolvedValue({ ok: true, status: 200 });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return healthy status when all checks pass', async () => {
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = res.json.mock.calls[0][0];
    expect(response.globalStatus).toBe('healthy');
    expect(response.results.length).toBeGreaterThan(0);
  });
});
