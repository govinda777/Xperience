import { IWalletRepository, UserWalletData } from '../../repositories/IWalletRepository.js';

export class GetWalletUseCase {
  constructor(private walletRepository: IWalletRepository) {}

  async execute(userId: string): Promise<UserWalletData | null> {
    return this.walletRepository.getWallet(userId);
  }
}
