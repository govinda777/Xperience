import { ICompanyRepository } from '../../repositories/ICompanyRepository.js';
import { CalculateCompanyProgressUseCase } from './CalculateCompanyProgressUseCase.js';
import { AllowAccessToBootcampUseCase } from './AllowAccessToBootcampUseCase.js';

export interface MountainStatusResult {
  id: string;
  name: string;
  status: string;
  businessMapStatus: string;
  totalProgress: number;
  bootcampAllowed: boolean;
  departments: Array<{
    id: string;
    departmentName: string;
    progress: number;
  }>;
}

export class GetMountainStatusUseCase {
  constructor(
    private companyRepository: ICompanyRepository,
    private calculateCompanyProgress: CalculateCompanyProgressUseCase,
    private allowAccessToBootcamp: AllowAccessToBootcampUseCase
  ) {}

  async execute(companyId: string): Promise<MountainStatusResult> {
    const company = await this.companyRepository.getCompany(companyId);
    if (!company) {
      throw new Error('Company not found');
    }

    const departments = await this.companyRepository.getDepartments(companyId);
    const totalProgress = await this.calculateCompanyProgress.execute(companyId);
    const bootcampStatus = await this.allowAccessToBootcamp.execute(companyId);

    return {
      id: company.id,
      name: company.name,
      status: company.status,
      businessMapStatus: company.businessMapStatus,
      totalProgress,
      bootcampAllowed: bootcampStatus.allowed,
      departments
    };
  }
}
