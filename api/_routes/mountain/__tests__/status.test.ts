import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, createMockResponse } from '../../../__tests__/test-utils.js';
import statusHandler from '../status.js';
import { prisma } from '../../../lib/db.js';
import { verifyPrivyToken } from '../../../../lib/privy-server.js';
import { calculateCompanyProgress, allowAccessToBootcamp } from '../../../lib/mountain.js';

// Mock dependencies
vi.mock('../../../lib/db.js', () => ({
  prisma: {
    user: {
      findUnique: vi.fn()
    }
  }
}));

vi.mock('../../../../lib/privy-server.js', () => ({
  verifyPrivyToken: vi.fn()
}));

vi.mock('../../../lib/mountain.js', () => ({
  calculateCompanyProgress: vi.fn(),
  allowAccessToBootcamp: vi.fn()
}));

describe('GET /api/mountain/status', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return 401 if no authorization header is provided', async () => {
    const req = createMockRequest();
    const res = createMockResponse();

    await statusHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Missing or invalid authorization header' });
  });

  it('should return 401 if token is invalid', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer invalid-token' }
    });
    const res = createMockResponse();
    
    vi.mocked(verifyPrivyToken).mockResolvedValue(null);

    await statusHandler(req, res);

    expect(verifyPrivyToken).toHaveBeenCalledWith('invalid-token');
    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid token' });
  });

  it('should return 404 if user is not found in database', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer valid-token' }
    });
    const res = createMockResponse();
    
    vi.mocked(verifyPrivyToken).mockResolvedValue({ user_id: 'privy-123', session_id: 'sess-123' } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    await statusHandler(req, res);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { privyId: 'privy-123' },
      include: expect.any(Object)
    });
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: 'User not found in system' });
  });

  it('should return 500 if prisma throws an error', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer valid-token' }
    });
    const res = createMockResponse();
    
    vi.mocked(verifyPrivyToken).mockResolvedValue({ user_id: 'privy-123', session_id: 'sess-123' } as any);
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('Prisma Client Initialization Error'));

    await statusHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error', details: 'Prisma Client Initialization Error' });
  });

  it('should return 200 with company data when successful', async () => {
    const req = createMockRequest({
      headers: { authorization: 'Bearer valid-token' }
    });
    const res = createMockResponse();
    
    vi.mocked(verifyPrivyToken).mockResolvedValue({ user_id: 'privy-123', session_id: 'sess-123' } as any);
    
    const mockUser = {
      id: 'user-1',
      privyId: 'privy-123',
      companyId: 'company-1',
      company: {
        id: 'company-1',
        name: 'Test Company',
        status: 'Em subida',
        businessMapStatus: 'Aprovado',
        departments: [
          { id: 'dep-1', departmentName: 'Engineering', progress: 50 }
        ]
      }
    };
    
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(calculateCompanyProgress).mockResolvedValue(75);
    vi.mocked(allowAccessToBootcamp).mockResolvedValue({ allowed: true });

    await statusHandler(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      companyData: {
        id: 'company-1',
        name: 'Test Company',
        status: 'Em subida',
        businessMapStatus: 'Aprovado',
        totalProgress: 75,
        bootcampAllowed: true,
        departments: [
          { id: 'dep-1', departmentName: 'Engineering', progress: 50 }
        ]
      }
    });
  });
});
