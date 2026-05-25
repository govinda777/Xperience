import { prisma } from './db.js';

/**
 * Calculates the total progress of a company by aggregating the progress
 * of all its departments.
 * We want the "soma ponderada dos KPIs" instead of an average.
 * We calculate the sum of objectives met for each department.
 * @param companyId The ID of the company.
 * @returns The total aggregated progress score (sum of all departments' progress).
 */
export async function calculateCompanyProgress(companyId: string): Promise<number> {
  const departments = await prisma.departmentTrack.findMany({
    where: { companyId },
  });

  if (departments.length === 0) {
    return 0;
  }

  // Calculate sum of all department progress (which represents KPI fulfillment)
  const totalProgress = departments.reduce((acc, dept) => acc + (dept.progress || 0), 0);

  return totalProgress;
}

/**
 * Checks if a company is allowed to access the Bootcamp.
 * The requirement is that the "Mapa do Negócio" is completed FIRST,
 * and then all members have defined their departments,
 * and the total progress is >= 100%.
 * @param companyId The ID of the company.
 * @returns An object indicating if access is allowed and the current progress.
 */
export async function allowAccessToBootcamp(companyId: string): Promise<{ allowed: boolean; progress: number }> {
  // Check the company's business map status
  const company = await prisma.company.findUnique({
    where: { id: companyId },
  });

  if (!company || company.businessMapStatus !== "Concluído") {
    // Cannot proceed without the initial map completed
    return { allowed: false, progress: 0 };
  }

  // Check if all members of the company have defined their department.
  const usersWithoutDept = await prisma.user.count({
    where: {
      companyId,
      departmentId: null,
    },
  });

  if (usersWithoutDept > 0) {
    return { allowed: false, progress: 0 }; // Not all members have defined their department
  }

  const departments = await prisma.departmentTrack.findMany({
    where: { companyId },
  });

  if (departments.length === 0) {
    return { allowed: false, progress: 0 };
  }

  const totalProgress = departments.reduce((acc, dept) => acc + (dept.progress || 0), 0);

  // Update the company status if they reached the peak
  if (totalProgress >= 100 && company.status !== 'No cume') {
    await prisma.company.update({
      where: { id: companyId },
      data: { status: 'No cume' }
    });
  }

  return {
    allowed: totalProgress >= 100,
    progress: totalProgress,
  };
}
