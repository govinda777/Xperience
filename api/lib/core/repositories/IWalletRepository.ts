export interface UserWalletData {
  userId: string;
  eoaAddress: string;
  smartAccountAddress: string;
  network?: string;
  createdAt: number;
}

export interface IWalletRepository {
  getWallet(userId: string): Promise<UserWalletData | null>;
  storeWallet(data: UserWalletData): Promise<void>;
  linkWallet(
    userId: string,
    eoaAddress: string,
    smartAccountAddress: string,
    network?: string
  ): Promise<UserWalletData>;
}
