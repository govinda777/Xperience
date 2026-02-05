import handler from '../../api/search-console';
import { google } from 'googleapis';

jest.mock('googleapis', () => {
  const mSitemaps = {
    list: jest.fn(),
  };
  const mUrlInspection = {
    index: {
      inspect: jest.fn(),
    },
  };
  const mSearchConsole = {
    sitemaps: mSitemaps,
    urlInspection: mUrlInspection,
  };
  return {
    google: {
      auth: {
        GoogleAuth: jest.fn(),
      },
      searchconsole: jest.fn(() => mSearchConsole),
    },
  };
});

describe('Search Console API Handler', () => {
  const mockRequest = (query = {}) => ({
    method: 'GET',
    query,
  } as any);

  const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    res.setHeader = jest.fn();
    return res;
  };

  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };
    process.env.GOOGLE_CLIENT_EMAIL = 'test@example.com';
    process.env.GOOGLE_PRIVATE_KEY = 'private-key';
    process.env.VITE_SITE_URL = 'https://example.com';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should return 405 for non-GET methods', async () => {
    const req = { method: 'POST' } as any;
    const res = mockResponse();
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('should return data successfully', async () => {
    const req = mockRequest({ siteUrl: 'https://example.com' });
    const res = mockResponse();

    const searchConsoleMock = google.searchconsole({ version: 'v1' });
    (searchConsoleMock.sitemaps.list as jest.Mock).mockResolvedValue({
      data: {
        sitemap: [
          {
            contents: [
              { type: 'web', submitted: '10', indexed: '8' },
            ],
          },
        ],
      },
    });

    (searchConsoleMock.urlInspection.index.inspect as jest.Mock).mockResolvedValue({
      data: {
        inspectionResult: {
          indexStatusResult: {
            verdict: 'PASS',
            lastCrawlTime: '2023-01-01T00:00:00Z',
          },
        },
      },
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      indexedPages: 8,
      totalPages: 10,
      errors: [],
      warnings: [],
      lastCrawl: '2023-01-01T00:00:00Z',
    });
  });

  it('should handle missing sitemaps gracefully', async () => {
    const req = mockRequest();
    const res = mockResponse();

    const searchConsoleMock = google.searchconsole({ version: 'v1' });
    (searchConsoleMock.sitemaps.list as jest.Mock).mockRejectedValue(new Error('No sitemaps'));
    (searchConsoleMock.urlInspection.index.inspect as jest.Mock).mockResolvedValue({
       data: {
        inspectionResult: {
          indexStatusResult: {
            verdict: 'FAIL',
            lastCrawlTime: '2023-01-01T00:00:00Z',
          },
        },
      },
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
       indexedPages: 0,
       totalPages: 0,
       errors: ['Homepage indexing failed'],
    }));
  });
});
