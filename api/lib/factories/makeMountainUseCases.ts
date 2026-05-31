import { PrismaCompanyRepository } from '../infrastructure/mountain/PrismaCompanyRepository.js';
import { CalculateCompanyProgressUseCase } from '../core/use-cases/mountain/CalculateCompanyProgressUseCase.js';
import { AllowAccessToBootcampUseCase } from '../core/use-cases/mountain/AllowAccessToBootcampUseCase.js';
import { GetMountainStatusUseCase } from '../core/use-cases/mountain/GetMountainStatusUseCase.js';

export function makeCalculateCompanyProgressUseCase(): CalculateCompanyProgressUseCase {
  const repository = new PrismaCompanyRepository();
  return new CalculateCompanyProgressUseCase(repository);
}

export function makeAllowAccessToBootcampUseCase(): AllowAccessToBootcampUseCase {
  const repository = new PrismaCompanyRepository();
  return new AllowAccessToBootcampUseCase(repository);
}

export function makeGetMountainStatusUseCase(): GetMountainStatusUseCase {
  const repository = new PrismaCompanyRepository();
  const calculateProgressUseCase = new CalculateCompanyProgressUseCase(repository);
  const bootcampUseCase = new AllowAccessToBootcampUseCase(repository);
  return new GetMountainStatusUseCase(repository, calculateProgressUseCase, bootcampUseCase);
}
