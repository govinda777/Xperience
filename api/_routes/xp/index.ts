import type { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../../lib/auth-middleware.js';
import { setCorsHeaders } from '../../_lib/middleware.js';
import { prisma } from '../../lib/db.js';
import crypto from 'crypto';

// Define allowed missions with their specific XP rewards and cooldowns (in ms)
const MISSIONS: Record<string, { xp: number; cooldown: number }> = {
  daily_checkin: { xp: 10, cooldown: 24 * 60 * 60 * 1000 },
  complete_onboarding: { xp: 100, cooldown: Infinity },
  generate_dossier: { xp: 50, cooldown: 12 * 60 * 60 * 1000 },
  explore_solution: { xp: 15, cooldown: 60 * 60 * 1000 },
};

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  setCorsHeaders(res);

  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: 'User not identified' });
  }

  if (req.method === 'GET') {
    try {
      const userXp = await prisma.userXp.findUnique({
        where: { userId },
        include: { history: { orderBy: { createdAt: 'desc' }, take: 100 } }
      });
      return res.status(200).json({
        userId,
        xp: userXp?.totalXp || 0,
        level: userXp?.level || 1,
        history: userXp?.history || []
      });
    } catch (error) {
      console.error('[XP API] Error fetching XP:', error);
      return res.status(500).json({ error: 'Failed to fetch XP' });
    }
  }

  if (req.method === 'POST') {
    const { reason, missionKey } = req.body;

    if (!missionKey || typeof missionKey !== 'string') {
        return res.status(400).json({ error: 'missionKey is required' });
    }

    const missionConfig = MISSIONS[missionKey];
    if (!missionConfig) {
      return res.status(400).json({ error: 'Invalid missionKey' });
    }

    const amount = missionConfig.xp;

    try {
      // Check cooldown
      const cooldown = await prisma.missionCooldown.findUnique({
        where: { userId_missionKey: { userId, missionKey } }
      });

      if (cooldown && cooldown.expiresAt > new Date()) {
        return res.status(429).json({
          error: 'Mission is on cooldown',
          expiresAt: cooldown.expiresAt
        });
      }

      const nonce = crypto.randomUUID();
      const cooldownDuration = missionConfig.cooldown;
      
      let expiresAt = new Date();
      if (cooldownDuration === Infinity) {
          expiresAt = new Date('9999-12-31T23:59:59.999Z');
      } else {
          expiresAt = new Date(Date.now() + cooldownDuration);
      }

      // Execute transaction
      const result = await prisma.$transaction(async (tx: any) => {
        // 1. Update or create UserXp
        const userXp = await tx.userXp.upsert({
          where: { userId },
          update: {
            totalXp: { increment: amount },
            // Optional: Implement level up logic here
          },
          create: {
            userId,
            totalXp: amount,
            level: 1
          }
        });

        // 2. Create XpTransaction
        await tx.xpTransaction.create({
          data: {
            userId,
            amount,
            reason: reason || missionKey,
            nonce
          }
        });

        // 3. Update or create MissionCooldown
        await tx.missionCooldown.upsert({
          where: { userId_missionKey: { userId, missionKey } },
          update: {
            expiresAt,
            lastClaimed: new Date()
          },
          create: {
            userId,
            missionKey,
            expiresAt
          }
        });

        return userXp;
      });

      return res.status(200).json({
        userId,
        xp: result.totalXp,
        added: amount,
        level: result.level
      });
    } catch (error) {
      console.error('[XP API] Error updating XP:', error);
      return res.status(500).json({ error: 'Failed to update XP' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler);
