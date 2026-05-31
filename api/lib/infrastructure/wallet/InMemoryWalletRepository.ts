import { IWalletRepository, UserWalletData } from '../../core/repositories/IWalletRepository.js';

// In-memory persistence fallback
const walletStore = new Map<string, UserWalletData>();

export class InMemoryWalletRepository implements IWalletRepository {
  async getWallet(userId: string): Promise<UserWalletData | null> {
    try {
      return walletStore.get(userId) || null;
    } catch (error) {
      console.error('Failed to get wallet:', error);
      return null;
    }
  }

  async storeWallet(data: UserWalletData): Promise<void> {
    try {
      walletStore.set(data.userId, data);
    } catch (error) {
      console.error('Failed to store wallet:', error);
      throw new Error('Persistence failed');
    }
  }

  async linkWallet(
    userId: string,
    eoaAddress: string,
    smartAccountAddress: string,
    network: string = 'sepolia'
  ): Promise<UserWalletData> {
    const data: UserWalletData = {
      userId,
      eoaAddress,
      smartAccountAddress,
      network,
      createdAt: Date.now()
    };
    
    await this.storeWallet(data);
    return data;
  }
}
