import handler from '../../api/health-config';
import { HEALTH_CONFIG } from '../../api/lib/health-config';

// Mock environment variables
const originalEnv = process.env;

describe('Health Config API', () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    jest.resetModules();
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

  it('should return 401 if unauthorized', async () => {
    req.headers.authorization = 'Bearer wrong-token';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(401);
  });

  it('should return current config on GET', async () => {
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(HEALTH_CONFIG);
  });

  it('should update config on POST', async () => {
    req.method = 'POST';
    req.body = {
      service: 'postgres',
      enabled: false
    };

    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(HEALTH_CONFIG.postgres.enabled).toBe(false);

    // Reset for other tests
    HEALTH_CONFIG.postgres.enabled = true;
  });
});
