import handler from '../../api/chat';
import OpenAI from 'openai';

// Mock OpenAI
jest.mock('openai', () => {
  const mockOpenAI = jest.fn().mockImplementation((config) => {
    return {
      chat: {
        completions: {
          create: jest.fn().mockResolvedValue({
            choices: [{ message: 'mock response' }]
          })
        }
      },
      apiKey: config.apiKey // Store it to verify
    };
  });

  return {
    __esModule: true,
    default: mockOpenAI,
  };
});

describe('API Chat Handler', () => {
  let req: any;
  let res: any;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };

    req = {
      method: 'POST',
      body: { messages: [] },
    };
    res = {
      setHeader: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      end: jest.fn(),
    };
    process.env.OPENAI_API_KEY = 'test-key';
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should trim the API key', async () => {
    process.env.OPENAI_API_KEY = '  sk-test-key-with-spaces  ';

    await handler(req, res);

    // OpenAI is imported as default, so we check the mock
    expect(OpenAI).toHaveBeenCalledWith(expect.objectContaining({ apiKey: 'sk-test-key-with-spaces' }));
  });

  it('should sanitize error logs', async () => {
    // Force an error
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const mockCreate = jest.fn().mockRejectedValue({
       message: 'Incorrect API key provided: sk-abcdef1234567890abcdef1234567890. You can find...',
       code: 'invalid_api_key'
    });

    // We need to access the mock implementation of the default export
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      chat: { completions: { create: mockCreate } }
    }));

    process.env.OPENAI_API_KEY = 'sk-test-key';

    await handler(req, res);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'OpenAI Error:',
      expect.stringContaining('sk-***'),
      '(Code: invalid_api_key)'
    );

    // Ensure the full key is NOT logged
    const calls = consoleErrorSpy.mock.calls;
    const allArgs = calls.flat().join(' ');
    expect(allArgs).not.toContain('sk-abcdef1234567890abcdef1234567890');

    consoleErrorSpy.mockRestore();
  });
});
