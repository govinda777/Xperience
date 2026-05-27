import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../../lib/auth-middleware.js';
import { WalletPersistenceService } from '../../lib/services/wallet-service.js';

/**
 * GET /api/user/wallet - Get vinculated wallet
 * POST /api/user/wallet - Link a new wallet
 */
async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const userId = req.userId;
  
  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (req.method === 'GET') {
    try {
      const wallet = await WalletPersistenceService.getWallet(userId);
      if (!wallet) {
        return res.status(404).json({ error: 'No wallet linked to this user' });
      }
      return res.status(200).json(wallet);
    } catch (error) {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  if (req.method === 'POST') {
    const { eoaAddress, smartAccountAddress, network } = req.body;

    if (!eoaAddress || !smartAccountAddress) {
      return res.status(400).json({ error: 'Missing eoaAddress or smartAccountAddress' });
    }

    try {
      const wallet = await WalletPersistenceService.linkWallet(
        userId,
        eoaAddress,
        smartAccountAddress,
        network
      );
      return res.status(201).json(wallet);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to link wallet' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler);
