import { ICompanyRepository } from '../../repositories/ICompanyRepository.js';

export interface BootcampAccessResult {
  allowed: boolean;
  progress: number;
}

export class AllowAccessToBootcampUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(companyId: string): Promise<BootcampAccessResult> {
    const company = await this.companyRepository.getCompany(companyId);

    if (!company || company.businessMapStatus !== "Concluído") {
      return { allowed: false, progress: 0 };
    }

    const usersWithoutDept = await this.companyRepository.countUsersWithoutDepartment(companyId);
    if (usersWithoutDept > 0) {
      return { allowed: false, progress: 0 };
    }

    const departments = await this.companyRepository.getDepartments(companyId);
    if (departments.length === 0) {
      return { allowed: false, progress: 0 };
    }

    const totalProgress = departments.reduce((acc, dept) => acc + dept.progress, 0);

    if (totalProgress >= 100 && company.status !== 'No cume') {
      await this.companyRepository.updateCompanyStatus(companyId, 'No cume');
    }

    return {
      allowed: totalProgress >= 100,
      progress: totalProgress,
    };
  }
}
