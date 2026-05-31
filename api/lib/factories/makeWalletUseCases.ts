import { InMemoryWalletRepository } from '../infrastructure/wallet/InMemoryWalletRepository.js';
import { GetWalletUseCase } from '../core/use-cases/wallet/GetWalletUseCase.js';
import { LinkWalletUseCase } from '../core/use-cases/wallet/LinkWalletUseCase.js';

// Use a singleton for the memory repository to keep state across requests in the same lambda container
const walletRepository = new InMemoryWalletRepository();

export function makeGetWalletUseCase(): GetWalletUseCase {
  return new GetWalletUseCase(walletRepository);
}

export function makeLinkWalletUseCase(): LinkWalletUseCase {
  return new LinkWalletUseCase(walletRepository);
}
