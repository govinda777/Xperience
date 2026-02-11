import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../lib/auth-middleware';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    return res.status(200).json(req.session);
  } catch (error) {
    console.error('Session fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch session' });
  }
}

export default withAuth(handler);
