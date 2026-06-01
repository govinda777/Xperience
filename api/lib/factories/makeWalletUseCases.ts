import { PrismaWalletRepository } from '../infrastructure/wallet/PrismaWalletRepository.js';
import { GetWalletUseCase } from '../core/use-cases/wallet/GetWalletUseCase.js';
import { LinkWalletUseCase } from '../core/use-cases/wallet/LinkWalletUseCase.js';

export function makeGetWalletUseCase(): GetWalletUseCase {
  const repository = new PrismaWalletRepository();
  return new GetWalletUseCase(repository);
}

export function makeLinkWalletUseCase(): LinkWalletUseCase {
  const repository = new PrismaWalletRepository();
  return new LinkWalletUseCase(repository);
}
