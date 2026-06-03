import { ICompanyRepository, CompanyData, DepartmentData } from '../../core/repositories/ICompanyRepository.js';
import { prisma } from '../../db.js';

export class PrismaCompanyRepository implements ICompanyRepository {
  async getDepartments(companyId: string): Promise<DepartmentData[]> {
    const departments = await prisma.departmentTrack.findMany({
      where: { companyId },
    });
    return departments.map(d => ({
      id: d.id,
      departmentName: d.departmentName,
      progress: d.progress || 0,
    }));
  }

  async getCompany(companyId: string): Promise<CompanyData | null> {
    const company = await prisma.company.findUnique({
      where: { id: companyId },
    });

    if (!company) return null;

    return {
      id: company.id,
      name: company.name,
      status: company.status,
      businessMapStatus: company.businessMapStatus || '',
    };
  }

  async countUsersWithoutDepartment(companyId: string): Promise<number> {
    return prisma.user.count({
      where: {
        companyId,
        departmentId: null,
      },
    });
  }

  async updateCompanyStatus(companyId: string, status: string): Promise<void> {
    await prisma.company.update({
      where: { id: companyId },
      data: { status }
    });
  }
}
