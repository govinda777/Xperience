import { IWalletRepository, UserWalletData } from '../../repositories/IWalletRepository.js';

export interface LinkWalletRequest {
  userId: string;
  eoaAddress: string;
  smartAccountAddress: string;
  network?: string;
}

export class LinkWalletUseCase {
  constructor(private walletRepository: IWalletRepository) {}

  async execute(request: LinkWalletRequest): Promise<UserWalletData> {
    if (!request.eoaAddress || !request.smartAccountAddress) {
      throw new Error('Missing eoaAddress or smartAccountAddress');
    }

    return this.walletRepository.linkWallet(
      request.userId,
      request.eoaAddress,
      request.smartAccountAddress,
      request.network
    );
  }
}
