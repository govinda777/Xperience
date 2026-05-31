import { prisma } from '../../lib/db.js';
import { withMountainAuth } from '../../lib/auth-middleware.js';
import { makeGetMountainStatusUseCase } from '../../lib/factories/makeMountainUseCases.js';

export const routeHandler = withMountainAuth(async (req, res, claims) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const privyId = claims.user_id;

  try {
    // Find the user to get their companyId. Keep this minimal user resolution logic in the controller.
    const user = await prisma.user.findUnique({
      where: { privyId },
      include: {
        company: true
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found in system' });
    }

    if (!user.companyId || !user.company) {
      return res.status(404).json({ error: 'User does not belong to a company' });
    }

    const companyId = user.companyId;

    // Use the UseCase to get the complete Mountain status for the company
    const getMountainStatusUseCase = makeGetMountainStatusUseCase();
    const mountainStatus = await getMountainStatusUseCase.execute(companyId);

    return res.status(200).json({
      companyData: mountainStatus
    });
  } catch (error: any) {
    console.error('[StatusHandler] Error fetching mountain status:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
