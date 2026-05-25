import { prisma } from './db';

/**
 * Calculates the total progress of a company by aggregating the progress
 * of all its departments.
 * @param companyId The ID of the company.
 * @returns The total aggregated progress as a percentage.
 */
export async function calculateCompanyProgress(companyId: string): Promise<number> {
  const departments = await prisma.departmentTrack.findMany({
    where: { companyId },
  });

  if (departments.length === 0) {
    return 0;
  }

  // Calculate sum of all department progress
  const totalProgress = departments.reduce((acc, dept) => acc + (dept.progress || 0), 0);

  // Calculate average progress across all departments.
  // Assumes each department has a max progress of 100.
  const averageProgress = totalProgress / departments.length;

  return averageProgress;
}

/**
 * Checks if a company is allowed to access the Bootcamp.
 * The requirement is that all members have defined their departments,
 * filled the business map (represented by progress), and the total progress is >= 100%.
 * (Assuming the company's progress is defined as the sum of its departments hitting a certain threshold,
 * but based on "total progress >= 100%", we'll sum up progress or assume it reaches 100%).
 *
 * "A soma dos KPIs setoriais atinge o threshold definido pela liderança.
 * IF company.totalProgress >= 100% THEN allowAccessToBootcamp()"
 *
 * We will calculate the total progress and return a boolean.
 * @param companyId The ID of the company.
 * @returns An object indicating if access is allowed and the current progress.
 */
export async function allowAccessToBootcamp(companyId: string): Promise<{ allowed: boolean; progress: number }> {
  // First, check if all members of the company have defined their department.
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

  // Assuming progress is a sum of KPI values that should reach a certain threshold,
  // or it's simply the sum of all progress percentages.
  // The prompt states: "A soma dos KPIs setoriais atinge o threshold... IF company.totalProgress >= 100%"
  const totalProgress = departments.reduce((acc, dept) => acc + (dept.progress || 0), 0);

  // Update the company status if they reached the peak
  if (totalProgress >= 100) {
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
