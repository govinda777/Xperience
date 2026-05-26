import { prisma } from '../../lib/db.js';
import { withMountainAuth } from '../../lib/auth-middleware.js';

export default withMountainAuth(async (req, res, claims) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { inviterWalletNumber, userWalletNumber } = req.body;
  if (!inviterWalletNumber || !userWalletNumber) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const privyId = claims.user_id;

  try {
    // 1. Validar se o usuário já não pertence a outra empresa (Segurança)
    const existingUser = await prisma.user.findUnique({ where: { privyId } });
    if (existingUser?.companyId) {
      return res.status(403).json({ error: 'User already belongs to a company' });
    }

    // 2. Lógica de Join (Upsert seguro)
    const parent = await prisma.user.findUnique({ where: { walletNumber: inviterWalletNumber } });
    if (!parent?.companyId) return res.status(404).json({ error: 'Inviter invalid or not in a company' });

    const user = await prisma.user.upsert({
      where: { privyId },
      update: { parentId: parent.id, companyId: parent.companyId, walletNumber: userWalletNumber },
      create: { privyId, walletNumber: userWalletNumber, parentId: parent.id, companyId: parent.companyId }
    });

    return res.status(200).json({ message: 'Successfully joined the company network', user });
  } catch (error: any) {
    console.error('[JoinHandler] Error joining network:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
