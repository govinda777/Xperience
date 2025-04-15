import { WalletService } from './walletService';

// Interface for user wallet data storage
interface StoredWallet {
  userId: string;
  address: string;
  smartAccountAddress: string;
  encryptedKey?: string; // Optional encrypted private key if stored client-side
}

/**
 * Service to manage the association between users and their wallets
 */
export class UserWalletService {
  private walletService: WalletService;
  private localStorageKey = 'user_wallet_data';

  constructor() {
    this.walletService = new WalletService();
  }

  /**
   * Get a user's wallet or create one if it doesn't exist
   * @param userId The user's unique ID from OAuth
   * @returns The user's wallet information
   */
  async getOrCreateUserWallet(userId: string): Promise<StoredWallet> {
    // Check if the user already has a wallet
    const existingWallet = await this.getUserWallet(userId);
    
    if (existingWallet) {
      return existingWallet;
    }
    
    // Create a new wallet for the user
    const newWallet = await this.walletService.createWalletForUser(userId);
    
    // Store the wallet information
    const storedWallet: StoredWallet = {
      userId: newWallet.userId,
      address: newWallet.address,
      smartAccountAddress: newWallet.smartAccountAddress,
    };
    
    await this.storeUserWallet(storedWallet);
    
    return storedWallet;
  }

  /**
   * Get a user's wallet from storage
   * @param userId The user's unique ID
   * @returns The user's wallet information or null if not found
   */
  async getUserWallet(userId: string): Promise<StoredWallet | null> {
    try {
      // In a real implementation, this would likely be a database call
      // For this example, we're using localStorage
      const wallets = this.getStoredWallets();
      return wallets.find(wallet => wallet.userId === userId) || null;
    } catch (error) {
      console.error('Failed to get user wallet:', error);
      return null;
    }
  }

  /**
   * Store a user's wallet information
   * @param wallet The wallet information to store
   */
  async storeUserWallet(wallet: StoredWallet): Promise<void> {
    try {
      // In a real implementation, this would likely be a database call
      // For this example, we're using localStorage
      const wallets = this.getStoredWallets();
      
      // Remove any existing wallet for this user
      const filteredWallets = wallets.filter(w => w.userId !== wallet.userId);
      
      // Add the new wallet
      filteredWallets.push(wallet);
      
      // Save the updated wallets
      localStorage.setItem(this.localStorageKey, JSON.stringify(filteredWallets));
    } catch (error) {
      console.error('Failed to store user wallet:', error);
      throw new Error('Failed to store user wallet');
    }
  }

  /**
   * Get all stored wallets
   * @returns Array of stored wallets
   */
  private getStoredWallets(): StoredWallet[] {
    try {
      const storedData = localStorage.getItem(this.localStorageKey);
      return storedData ? JSON.parse(storedData) : [];
    } catch (error) {
      console.error('Failed to get stored wallets:', error);
      return [];
    }
  }

  /**
   * Delete a user's wallet
   * @param userId The user's unique ID
   */
  async deleteUserWallet(userId: string): Promise<void> {
    try {
      const wallets = this.getStoredWallets();
      const filteredWallets = wallets.filter(wallet => wallet.userId !== userId);
      localStorage.setItem(this.localStorageKey, JSON.stringify(filteredWallets));
    } catch (error) {
      console.error('Failed to delete user wallet:', error);
      throw new Error('Failed to delete user wallet');
    }
  }

  /**
   * Get a user's wallet balance
   * @param userId The user's unique ID
   * @returns The user's wallet balance in ETH
   */
  async getUserBalance(userId: string): Promise<string> {
    const wallet = await this.getUserWallet(userId);
    
    if (!wallet) {
      throw new Error('User wallet not found');
    }
    
    return this.walletService.getBalance(wallet.smartAccountAddress);
  }
} 