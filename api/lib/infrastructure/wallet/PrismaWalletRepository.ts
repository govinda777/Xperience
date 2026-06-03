import { IWalletRepository, UserWalletData } from '../../core/repositories/IWalletRepository.js';
import { prisma } from '../../db.js';

export class PrismaWalletRepository implements IWalletRepository {
  async getWallet(userId: string): Promise<UserWalletData | null> {
    try {
      const wallet = await prisma.userWallet.findUnique({
        where: { userId },
      });

      if (!wallet) return null;

      return {
        userId: wallet.userId,
        eoaAddress: wallet.eoaAddress,
        smartAccountAddress: wallet.smartAccountAddress,
        network: wallet.network,
        createdAt: wallet.createdAt.getTime(),
      };
    } catch (error) {
      console.error('Failed to get wallet from Prisma:', error);
      return null;
    }
  }

  async storeWallet(data: UserWalletData): Promise<void> {
    try {
      await prisma.userWallet.upsert({
        where: { userId: data.userId },
        update: {
          eoaAddress: data.eoaAddress,
          smartAccountAddress: data.smartAccountAddress,
          network: data.network || 'sepolia',
        },
        create: {
          userId: data.userId,
          eoaAddress: data.eoaAddress,
          smartAccountAddress: data.smartAccountAddress,
          network: data.network || 'sepolia',
          createdAt: new Date(data.createdAt),
        },
      });
    } catch (error) {
      console.error('Failed to store wallet in Prisma:', error);
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
