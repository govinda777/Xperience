import type { VercelRequest, VercelResponse } from '@vercel/node';
import { prisma } from '../../lib/db.js';
import { verifyPrivyToken } from '../../../lib/privy-server.js';

export default async function joinHandler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
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
    console.error('[JoinHandler] Privy token verification failed:', error);
    return res.status(401).json({ error: 'Invalid token' });
  }

  const privyId = verifiedClaims.user_id || verifiedClaims.user_id;

  // The walletNumber of the inviter should be in the body
  const { inviterWalletNumber, userWalletNumber } = req.body;

  if (!inviterWalletNumber || !userWalletNumber) {
    return res.status(400).json({ error: 'Missing inviterWalletNumber or userWalletNumber' });
  }

  try {
    // Find the inviter (parent)
    const parentUser = await prisma.user.findUnique({
      where: { walletNumber: inviterWalletNumber },
    });

    if (!parentUser) {
      return res.status(404).json({ error: 'Inviter not found' });
    }

    if (!parentUser.companyId) {
      return res.status(400).json({ error: 'Inviter does not belong to a company' });
    }

    // Upsert the joining user to link them to the parent and company
    const joiningUser = await prisma.user.upsert({
      where: { privyId },
      update: {
        parentId: parentUser.id,
        companyId: parentUser.companyId,
        walletNumber: userWalletNumber,
      },
      create: {
        privyId,
        walletNumber: userWalletNumber,
        parentId: parentUser.id,
        companyId: parentUser.companyId,
      },
    });

    return res.status(200).json({
      message: 'Successfully joined the company network',
      user: joiningUser,
    });
  } catch (error: any) {
    console.error('[JoinHandler] Error joining network:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
}
