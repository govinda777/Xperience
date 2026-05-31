import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../../../../lib/auth-middleware.js';
import { authClient } from '../../../../../lib/auth/index.js';
import { UserRole } from '../../../../../src/types/session.js';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { userId } = req.query;

  // Check Admin
  if (req.session?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  if (req.method === 'GET') {
    try {
      const user = await authClient.getUser(userId as string);
      const role = (user.custom_metadata as any)?.role || 'user';
      return res.status(200).json({ role });
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch role' });
    }
  }

  if (req.method === 'PUT') {
    const { role } = req.body as { role: UserRole };

    if (!role) {
      return res.status(400).json({ error: 'Role is required' });
    }

    try {
      await authClient.updateUserMetadata(userId as string, { role });
      return res.status(200).json({ success: true, role });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to update role' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export const routeHandler = withAuth(handler);
