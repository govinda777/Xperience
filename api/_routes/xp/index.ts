import type { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../../lib/auth-middleware.js';
import { setCorsHeaders } from '../../_lib/middleware.js';

// In-memory storage to persist user XP during local server development
const userXpStore = new Map<string, number>();
const xpHistoryStore = new Map<string, any[]>();

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  setCorsHeaders(res);

  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ error: 'User not identified' });
  }

  const xpKey = `user:${userId}:xp`;

  if (req.method === 'GET') {
    try {
      const xp = userXpStore.get(xpKey) || 0;
      return res.status(200).json({ userId, xp });
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
      const currentXp = userXpStore.get(xpKey) || 0;
      const newXp = currentXp + amount;
      userXpStore.set(xpKey, newXp);

      // Log the transaction
      const logEntry = {
        timestamp: new Date().toISOString(),
        amount,
        reason: reason || 'Não especificado',
        total: newXp
      };
      
      let history = xpHistoryStore.get(userId) || [];
      history.unshift(logEntry);
      history = history.slice(0, 100); // Keep max 100 entries
      xpHistoryStore.set(userId, history);

      return res.status(200).json({ userId, xp: newXp, added: amount });
    } catch (error) {
      console.error('[XP API] Error updating XP:', error);
      return res.status(500).json({ error: 'Failed to update XP' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler);
