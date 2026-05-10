import type { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../../lib/auth-middleware.js';
import { kv } from '../../lib/kv.js';
import { setCorsHeaders } from '../../_lib/middleware.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  setCorsHeaders(res);

  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: 'User not identified' });
  }

  const xpKey = `user:${userId}:xp`;

  if (req.method === 'GET') {
    try {
      const xp = await kv.get(xpKey) || 0;
      return res.status(200).json({ userId, xp: Number(xp) });
    } catch (error) {
      console.error('[XP API] Error fetching XP:', error);
      return res.status(500).json({ error: 'Failed to fetch XP' });
    }
  }

  if (req.method === 'POST') {
    const { amount, reason } = req.body;

    if (typeof amount !== 'number') {
      return res.status(400).json({ error: 'Amount must be a number' });
    }

    try {
      // In a real scenario, you might want to verify if the user has permission to grant XP
      // or if this is called from a trusted internal service.
      const newXp = await kv.incrby(xpKey, amount);

      // Log the transaction
      const logEntry = {
        timestamp: new Date().toISOString(),
        amount,
        reason: reason || 'Não especificado',
        total: newXp
      };
      await kv.lpush(`user:${userId}:xp_history`, JSON.stringify(logEntry));
      await kv.ltrim(`user:${userId}:xp_history`, 0, 99);

      return res.status(200).json({ userId, xp: newXp, added: amount });
    } catch (error) {
      console.error('[XP API] Error updating XP:', error);
      return res.status(500).json({ error: 'Failed to update XP' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler);
