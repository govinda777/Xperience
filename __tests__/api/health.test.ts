import handler from '../../api/health';
import { HEALTH_CONFIG } from '../../api/lib/health-config';

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

// Mock fetch
const fetchMock = jest.fn();
global.fetch = fetchMock;

// Mock environment variables
const originalEnv = process.env;

describe('Health Check API', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.resetModules();
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

  it('should return 401 if unauthorized', async () => {
    req.headers.authorization = 'Bearer wrong-token';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return healthy status when all checks pass', async () => {
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const response = res.json.mock.calls[0][0];
    expect(response.globalStatus).toBe('healthy');
    expect(response.results.length).toBeGreaterThan(0);
  });
});
