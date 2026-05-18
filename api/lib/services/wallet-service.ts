import { kv } from '@vercel/kv';

export interface UserWalletData {
  userId: string;
  eoaAddress: string;
  smartAccountAddress: string;
  network?: string;
  createdAt: number;
}

export class WalletPersistenceService {
  private static readonly KEY_PREFIX = 'user_wallet:';

  /**
   * Get wallet data for a user
   */
  static async getWallet(userId: string): Promise<UserWalletData | null> {
    try {
      return await kv.get<UserWalletData>(`${this.KEY_PREFIX}${userId}`);
    } catch (error) {
      console.error('Failed to get wallet from KV:', error);
      return null;
    }
  }

  /**
   * Store wallet data for a user
   */
  static async storeWallet(data: UserWalletData): Promise<void> {
    try {
      await kv.set(`${this.KEY_PREFIX}${data.userId}`, data);
    } catch (error) {
      console.error('Failed to store wallet in KV:', error);
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
