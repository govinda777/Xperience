import handler from '../../api/chat';
import { OpenAI } from 'openai';

jest.mock('openai', () => {
  const createMock = jest.fn();
  const mockConstructor = jest.fn().mockImplementation((config) => {
    return {
      chat: {
        completions: {
          create: createMock
        }
      },
      apiKey: config?.apiKey
    };
  });
  return {
    OpenAI: mockConstructor
  };
});

describe('API Chat Handler', () => {
  let req: any;
  let res: any;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env = { ...originalEnv };

    req = {
      method: 'POST',
      body: { messages: [], ragMetadata: {} },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    process.env.OPENAI_API_KEY = 'test-key';

    // Configure default success response
    const { OpenAI: MockOpenAI } = require('openai');
    const dummy = new MockOpenAI();
    dummy.chat.completions.create.mockResolvedValue({
      choices: [{ message: { content: 'mock response' } }],
      usage: { total_tokens: 10 }
    });
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should call OpenAI with provided messages', async () => {
    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      response: 'mock response'
    }));
  });

  it('should return 405 for non-POST requests', async () => {
    req.method = 'GET';
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(405);
  });

  it('should return 500 if API key is missing', async () => {
    delete process.env.OPENAI_API_KEY;
    await handler(req, res);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith(expect.objectContaining({
      error: 'Service Misconfigured: Missing API Key'
    }));
  });

  it('should handle OpenAI errors correctly', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const { OpenAI: MockOpenAI } = require('openai');
    const dummy = new MockOpenAI();
    dummy.chat.completions.create.mockRejectedValueOnce({
       status: 401,
       message: 'Incorrect API key provided',
       code: 'invalid_api_key'
    });

    await handler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(consoleErrorSpy).toHaveBeenCalledWith('❌ OpenAI Authentication Error (401). Check API Key.');

    consoleErrorSpy.mockRestore();
  });

  it('should sanitize error logs', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const sensitiveKey = 'sk-abcdef1234567890abcdef1234567890';
    const { OpenAI: MockOpenAI } = require('openai');
    const dummy = new MockOpenAI();
    dummy.chat.completions.create.mockRejectedValueOnce({
       message: `Incorrect API key provided: ${sensitiveKey}. You can find...`,
       code: 'invalid_api_key'
    });

    await handler(req, res);

    // Ensure the full key is NOT logged in a recognizable way
    const calls = consoleErrorSpy.mock.calls;
    const allArgs = calls.flat().map(arg => typeof arg === 'string' ? arg : JSON.stringify(arg)).join(' ');
    expect(allArgs).not.toContain(sensitiveKey);

    consoleErrorSpy.mockRestore();
  });
});
