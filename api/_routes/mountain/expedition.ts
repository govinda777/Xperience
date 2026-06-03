import { prisma } from '../../lib/db.js';
import { withMountainAuth } from '../../lib/auth-middleware.js';

export const routeHandler = withMountainAuth(async (req, res, claims) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const privyId = claims.user_id;

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

    // Retrieve all members of the company
    const members = await prisma.user.findMany({
      where: { companyId: user.companyId },
      include: {
        department: true
      }
    });

    // Group members by department
    const expeditionStructure: Record<string, any> = {};

    members.forEach(member => {
        const deptName = member.department?.departmentName || 'Sem Departamento';
        if (!expeditionStructure[deptName]) {
            expeditionStructure[deptName] = [];
        }

        expeditionStructure[deptName].push({
            id: member.id,
            walletNumber: member.walletNumber,
            status: 'Ativo', // Mocked status, could be derived from last login
            kpiContribution: member.department?.progress || 0 // Simplifying individual contribution to the department's progress for now
        });
    });

    return res.status(200).json({
      companyName: user.company?.name,
      expedition: expeditionStructure
    });

  } catch (error: any) {
    console.error('[ExpeditionHandler] Error fetching expedition:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
