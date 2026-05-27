import { vi } from 'vitest';
import type { VercelRequest, VercelResponse } from '@vercel/node';

export function createMockRequest(options: Partial<VercelRequest> = {}): VercelRequest {
  return {
    headers: {},
    query: {},
    cookies: {},
    body: {},
    method: 'GET',
    ...options,
  } as unknown as VercelRequest;
}

export function createMockResponse() {
  const res: any = {};
  res.status = vi.fn().mockReturnValue(res);
  res.json = vi.fn().mockReturnValue(res);
  res.send = vi.fn().mockReturnValue(res);
  res.setHeader = vi.fn().mockReturnValue(res);
  res.end = vi.fn().mockReturnValue(res);
  return res as VercelResponse & {
    status: ReturnType<typeof vi.fn>;
    json: ReturnType<typeof vi.fn>;
    send: ReturnType<typeof vi.fn>;
    setHeader: ReturnType<typeof vi.fn>;
    end: ReturnType<typeof vi.fn>;
  };
}
