import { ICompanyRepository } from '../../repositories/ICompanyRepository.js';

export class CalculateCompanyProgressUseCase {
  constructor(private companyRepository: ICompanyRepository) {}

  async execute(companyId: string): Promise<number> {
    const departments = await this.companyRepository.getDepartments(companyId);

    if (departments.length === 0) {
      return 0;
    }

    // Calculate sum of all department progress (which represents KPI fulfillment)
    const totalProgress = departments.reduce((acc, dept) => acc + dept.progress, 0);

    return totalProgress;
  }
}
