import { prisma } from '../../lib/db.js';
import { withMountainAuth } from '../../lib/auth-middleware.js';

export default withMountainAuth(async (req, res, claims) => {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const privyId = claims.user_id;
  const mapData = req.body;

  if (!mapData || typeof mapData !== 'object') {
    return res.status(400).json({ error: 'Invalid map data' });
  }

  try {
    // Find the user to get their companyId
    const user = await prisma.user.findUnique({
      where: { privyId },
      include: {
        company: true
      }
    });

    if (!user || !user.companyId) {
      return res.status(404).json({ error: 'User does not belong to a company' });
    }

    const updatedCompany = await prisma.company.update({
      where: { id: user.companyId },
      data: {
        businessMapData: mapData,
        businessMapStatus: 'Concluído'
      }
    });

    return res.status(200).json({
      message: 'Business map updated successfully',
      company: updatedCompany
    });

  } catch (error: any) {
    console.error('[MapHandler] Error updating business map:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
