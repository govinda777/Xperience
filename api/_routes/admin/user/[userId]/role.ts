import { VercelResponse } from '@vercel/node';
import { withAuth, AuthenticatedRequest } from '../../../../lib/auth-middleware';
import { RoleService } from '../../../../../lib/services/role-service';
import { UserRole } from '../../../../../src/types/session';

async function handler(req: AuthenticatedRequest, res: VercelResponse) {
  const { userId } = req.query;

  // Check Admin
  if (req.session?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }

  if (req.method === 'GET') {
    try {
      const role = await RoleService.getUserRole(userId as string);
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
      await RoleService.setUserRole(userId as string, role);
      return res.status(200).json({ success: true, role });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Failed to update role' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

export default withAuth(handler);
