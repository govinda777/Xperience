import { prisma } from '../../../lib/db.js';
import { withMountainAuth } from '../../../lib/auth-middleware.js';

export default withMountainAuth(async (req, res, claims) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const adminPrivyId = claims.user_id;

  try {
    // Validate admin role
    const adminUser = await prisma.user.findUnique({
      where: { privyId: adminPrivyId }
    });

    if (!adminUser || adminUser.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden: Admin access required' });
    }

    const { walletNumber } = req.body;

    if (!walletNumber) {
      return res.status(400).json({ error: 'Missing walletNumber parameter' });
    }

    const targetUser = await prisma.user.findUnique({
      where: { walletNumber }
    });

    if (!targetUser) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Remove the user's company and parent links
    const updatedUser = await prisma.user.update({
      where: { walletNumber },
      data: {
        companyId: null,
        parentId: null
      }
    });

    return res.status(200).json({
      message: 'Successfully removed company association from user',
      user: updatedUser
    });

  } catch (error: any) {
    console.error('[AdminRemoveCompany] Error removing company:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
