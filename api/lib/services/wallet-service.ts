export interface UserWalletData {
  userId: string;
  eoaAddress: string;
  smartAccountAddress: string;
  network?: string;
  createdAt: number;
}

// In-memory persistence fallback to replace Redis/KV dependency
const walletStore = new Map<string, UserWalletData>();

export class WalletPersistenceService {
  /**
   * Get wallet data for a user
   */
  static async getWallet(userId: string): Promise<UserWalletData | null> {
    try {
      return walletStore.get(userId) || null;
    } catch (error) {
      console.error('Failed to get wallet:', error);
      return null;
    }
  }

  /**
   * Store wallet data for a user
   */
  static async storeWallet(data: UserWalletData): Promise<void> {
    try {
      walletStore.set(data.userId, data);
    } catch (error) {
      console.error('Failed to store wallet:', error);
      throw new Error('Persistence failed');
    }
  }

  /**
   * Link an EOA address to a smart account for a user
   */
  static async linkWallet(
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
