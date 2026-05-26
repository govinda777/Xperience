import { prisma } from '../../lib/db.js';
import { withMountainAuth } from '../../lib/auth-middleware.js';
import { calculateCompanyProgress, allowAccessToBootcamp } from '../../lib/mountain.js';

export default withMountainAuth(async (req, res, claims) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const privyId = claims.user_id;

  try {
    // Find the user to get their companyId
    const user = await prisma.user.findUnique({
      where: { privyId },
      include: {
        company: {
          include: {
            departments: true,
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found in system' });
    }

    if (!user.companyId || !user.company) {
      return res.status(404).json({ error: 'User does not belong to a company' });
    }

    const companyId = user.companyId;

    // Calculate progress and bootcamp access
    const totalProgress = await calculateCompanyProgress(companyId);
    const bootcampStatus = await allowAccessToBootcamp(companyId);

    return res.status(200).json({
      companyData: {
        id: user.company.id,
        name: user.company.name,
        status: user.company.status,
        businessMapStatus: user.company.businessMapStatus,
        totalProgress,
        bootcampAllowed: bootcampStatus.allowed,
        departments: user.company.departments.map(d => ({
          id: d.id,
          departmentName: d.departmentName,
          progress: d.progress,
        })),
      }
    });
  } catch (error: any) {
    console.error('[StatusHandler] Error fetching mountain status:', error);
    return res.status(500).json({ error: 'Internal Server Error', details: error.message });
  }
});
