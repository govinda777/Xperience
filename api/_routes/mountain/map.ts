import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/db.js';
import { verifyPrivyToken } from '../../../lib/privy-server.js';

export default async function mapHandler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Expecting a bearer token from Privy
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization header' });
  }

  const token = authHeader.split(' ')[1];

  let verifiedClaims;
  try {
    verifiedClaims = await verifyPrivyToken(token);
    if (!verifiedClaims) {
        return res.status(401).json({ error: 'Invalid token' });
    }
  } catch (error) {
    console.error('[MapHandler] Privy token verification failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }

  const privyId = verifiedClaims.user_id || verifiedClaims.user_id;

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
}
