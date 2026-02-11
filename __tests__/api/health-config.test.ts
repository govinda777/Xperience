import handler from '../../api/health-config';
import { kv } from '../../api/lib/kv';

// Mock kv
jest.mock('../../api/lib/kv', () => ({
  kv: {
    get: jest.fn(),
    set: jest.fn(),
  },
}));

// Mock environment variables
const originalEnv = process.env;

describe('Health Config API', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.HEALTH_CHECK_TOKEN = 'test-token';

    req = {
      method: 'GET',
      headers: {
        authorization: 'Bearer test-token',
      },
      body: {},
    };

    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return current config on GET', async () => {
    // Mock kv.get to return a config
    const mockConfig = { postgres: { name: 'Postgres', enabled: true } };
    (kv.get as jest.Mock).mockResolvedValue(mockConfig);

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    expect(kv.get).toHaveBeenCalledWith('health:config');
    const response = res.json.mock.calls[0][0];
    // Check if the response contains the mocked config
    expect(response.postgres.enabled).toBe(true);
  });

  it('should initialize config on GET if empty', async () => {
    // Mock kv.get to return null
    (kv.get as jest.Mock).mockResolvedValue(null);

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);

    // Should have called set with default config
    expect(kv.set).toHaveBeenCalledWith('health:config', expect.any(Object));
  });

  it('should return 401 on POST without valid token', async () => {
    req.method = 'POST';
    req.body = { service: 'postgres', enabled: false };
    req.headers.authorization = 'Bearer wrong-token';

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should update config on POST with valid token', async () => {
    req.method = 'POST';
    req.body = {
      service: 'postgres',
      enabled: false
    };
    req.headers.authorization = 'Bearer test-token';

    // Mock initial get
    const mockConfig = { postgres: { name: 'Postgres', enabled: true } };
    (kv.get as jest.Mock).mockResolvedValue(mockConfig);

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);

    // Expect kv.set to have been called with updated config
    expect(kv.set).toHaveBeenCalledWith('health:config', expect.objectContaining({
        postgres: expect.objectContaining({ enabled: false })
    }));
  });

  it('should return 400 if service not found', async () => {
    req.headers.authorization = 'Bearer test-token'; // Add token
    req.method = 'POST';
    req.body = {
        service: 'unknown_service',
        enabled: false
    };

    const mockConfig = { postgres: { name: 'Postgres', enabled: true } };
    (kv.get as jest.Mock).mockResolvedValue(mockConfig);

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });
});
