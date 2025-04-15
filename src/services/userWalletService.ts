import { WalletService } from './walletService';
import CryptoJS from 'crypto-js'; // Add crypto library for encryption

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
  private recoveryKeyPrefix = 'recovery_';

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

  /**
   * Securely store a user's private key
   * @param userId The user's unique ID
   * @param privateKey The private key to encrypt and store
   * @param password User password or secret to encrypt the key
   */
  async storePrivateKey(userId: string, privateKey: string, password: string): Promise<void> {
    try {
      // Get the user's wallet
      const wallet = await this.getUserWallet(userId);
      
      if (!wallet) {
        throw new Error('User wallet not found');
      }
      
      // Encrypt the private key using the password
      const encryptedKey = CryptoJS.AES.encrypt(privateKey, password).toString();
      
      // Update the wallet with the encrypted key
      wallet.encryptedKey = encryptedKey;
      
      // Store the updated wallet
      await this.storeUserWallet(wallet);
    } catch (error) {
      console.error('Failed to store private key:', error);
      throw new Error('Failed to store private key');
    }
  }

  /**
   * Retrieve and decrypt a user's private key
   * @param userId The user's unique ID
   * @param password User password or secret to decrypt the key
   * @returns The decrypted private key
   */
  async getPrivateKey(userId: string, password: string): Promise<string> {
    try {
      // Get the user's wallet
      const wallet = await this.getUserWallet(userId);
      
      if (!wallet || !wallet.encryptedKey) {
        throw new Error('User wallet or private key not found');
      }
      
      // Decrypt the private key
      const bytes = CryptoJS.AES.decrypt(wallet.encryptedKey, password);
      const privateKey = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!privateKey) {
        throw new Error('Failed to decrypt private key - incorrect password');
      }
      
      return privateKey;
    } catch (error) {
      console.error('Failed to get private key:', error);
      throw new Error('Failed to get private key');
    }
  }

  /**
   * Generate a recovery key for a user's wallet
   * @param userId The user's unique ID
   * @param password User password or secret
   * @returns The recovery key
   */
  async generateRecoveryKey(userId: string, password: string): Promise<string> {
    try {
      // Get the user's private key
      const privateKey = await this.getPrivateKey(userId, password);
      
      // Generate a random recovery key
      const recoveryKey = CryptoJS.lib.WordArray.random(16).toString();
      
      // Encrypt the private key with the recovery key
      const encryptedWithRecovery = CryptoJS.AES.encrypt(privateKey, recoveryKey).toString();
      
      // Store the recovery data - in production this should be in a secure database
      localStorage.setItem(
        `${this.recoveryKeyPrefix}${userId}`, 
        encryptedWithRecovery
      );
      
      return recoveryKey;
    } catch (error) {
      console.error('Failed to generate recovery key:', error);
      throw new Error('Failed to generate recovery key');
    }
  }

  /**
   * Recover a wallet using a recovery key
   * @param userId The user's unique ID
   * @param recoveryKey The recovery key
   * @param newPassword New password to set
   * @returns Whether recovery was successful
   */
  async recoverWallet(userId: string, recoveryKey: string, newPassword: string): Promise<boolean> {
    try {
      // Get the encrypted recovery data
      const encryptedData = localStorage.getItem(`${this.recoveryKeyPrefix}${userId}`);
      
      if (!encryptedData) {
        throw new Error('No recovery data found for user');
      }
      
      // Decrypt the private key using the recovery key
      const bytes = CryptoJS.AES.decrypt(encryptedData, recoveryKey);
      const privateKey = bytes.toString(CryptoJS.enc.Utf8);
      
      if (!privateKey) {
        throw new Error('Failed to decrypt with recovery key');
      }
      
      // Re-encrypt with the new password and store
      await this.storePrivateKey(userId, privateKey, newPassword);
      
      return true;
    } catch (error) {
      console.error('Failed to recover wallet:', error);
      return false;
    }
  }
} 