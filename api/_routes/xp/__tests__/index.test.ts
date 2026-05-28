import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createMockRequest, createMockResponse } from '../../../__tests__/test-utils.js';
import xpHandler from '../index.js';
import { prisma } from '../../../lib/db.js';
import { authClient } from '../../../../lib/auth/index.js';
import { SessionService } from '../../../../lib/services/session-service.js';

// Mock dependencies
vi.mock('../../../lib/db.js', () => ({
  prisma: {
    userXp: {
      findUnique: vi.fn(),
    },
    missionCooldown: {
      findUnique: vi.fn(),
    },
    $transaction: vi.fn(),
  }
}));

vi.mock('../../../../lib/auth/index.js', () => ({
  authClient: {
    verifyToken: vi.fn(),
  }
}));

vi.mock('../../../../lib/services/session-service.js', () => ({
  SessionService: {
    createSession: vi.fn()
  }
}));

describe('XP Endpoint (/api/xp)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Authentication Middleware', () => {
    it('should return 401 if no token is provided', async () => {
      const req = createMockRequest();
      const res = createMockResponse();

      await xpHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ error: 'No token provided' });
    });

    it('should strip quotes from token and verify', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer "quoted-token"' },
        method: 'GET'
      });
      const res = createMockResponse();

      vi.mocked(authClient.verifyToken).mockResolvedValue({ user_id: 'user-1' } as any);
      vi.mocked(SessionService.createSession).mockResolvedValue({} as any);
      vi.mocked(prisma.userXp.findUnique).mockResolvedValue(null);

      await xpHandler(req, res);

      expect(authClient.verifyToken).toHaveBeenCalledWith('quoted-token');
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('GET Method', () => {
    it('should return user XP and history', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer valid-token' },
        method: 'GET'
      });
      const res = createMockResponse();

      vi.mocked(authClient.verifyToken).mockResolvedValue({ user_id: 'user-1' } as any);
      vi.mocked(SessionService.createSession).mockResolvedValue({} as any);
      
      vi.mocked(prisma.userXp.findUnique).mockResolvedValue({
        totalXp: 150,
        level: 2,
        history: [{ id: 'tx-1', amount: 150, reason: 'test' }]
      } as any);

      await xpHandler(req, res);

      expect(prisma.userXp.findUnique).toHaveBeenCalledWith({
        where: { userId: 'user-1' },
        include: { history: expect.any(Object) }
      });
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        userId: 'user-1',
        xp: 150,
        level: 2,
        history: [{ id: 'tx-1', amount: 150, reason: 'test' }]
      });
    });

    it('should return 500 if prisma fails', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer valid-token' },
        method: 'GET'
      });
      const res = createMockResponse();

      vi.mocked(authClient.verifyToken).mockResolvedValue({ user_id: 'user-1' } as any);
      vi.mocked(SessionService.createSession).mockResolvedValue({} as any);
      
      vi.mocked(prisma.userXp.findUnique).mockRejectedValue(new Error('DB Error'));

      await xpHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Failed to fetch XP' });
    });
  });

  describe('POST Method', () => {
    it('should return 400 if missionKey is invalid', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer valid-token' },
        method: 'POST',
        body: { missionKey: 'invalid_mission' }
      });
      const res = createMockResponse();

      vi.mocked(authClient.verifyToken).mockResolvedValue({ user_id: 'user-1' } as any);
      vi.mocked(SessionService.createSession).mockResolvedValue({} as any);

      await xpHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid missionKey' });
    });

    it('should return 429 if mission is on cooldown', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer valid-token' },
        method: 'POST',
        body: { missionKey: 'daily_checkin' }
      });
      const res = createMockResponse();

      vi.mocked(authClient.verifyToken).mockResolvedValue({ user_id: 'user-1' } as any);
      vi.mocked(SessionService.createSession).mockResolvedValue({} as any);
      
      const futureDate = new Date();
      futureDate.setHours(futureDate.getHours() + 1);
      vi.mocked(prisma.missionCooldown.findUnique).mockResolvedValue({ expiresAt: futureDate } as any);

      await xpHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(429);
      expect(res.json).toHaveBeenCalledWith({
        error: 'Mission is on cooldown',
        expiresAt: futureDate
      });
    });

    it('should process transaction and return 200 on success', async () => {
      const req = createMockRequest({
        headers: { authorization: 'Bearer valid-token' },
        method: 'POST',
        body: { missionKey: 'daily_checkin' }
      });
      const res = createMockResponse();

      vi.mocked(authClient.verifyToken).mockResolvedValue({ user_id: 'user-1' } as any);
      vi.mocked(SessionService.createSession).mockResolvedValue({} as any);
      
      vi.mocked(prisma.missionCooldown.findUnique).mockResolvedValue(null);
      vi.mocked(prisma.$transaction).mockResolvedValue({
        totalXp: 10,
        level: 1
      } as any);

      await xpHandler(req, res);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        userId: 'user-1',
        xp: 10,
        added: 10, // daily_checkin rewards 10 XP
        level: 1
      });
    });
  });
});
