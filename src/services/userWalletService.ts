import { WalletService } from "./walletService";
import { ENV } from "../config/env";
import CryptoJS from "crypto-js";

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
  private apiUrl = ENV.VITE_API_URL;
  private recoveryKeyPrefix = "recovery_";

  constructor() {
    this.walletService = new WalletService();
  }

  private async getAuthToken(): Promise<string | null> {
    // This is typically handled by the AuthContext, but for service calls
    // we might need to get it from memory or a global state if not passed.
    // Ideally, the token should be passed to the service methods.
    return localStorage.getItem('privy_token'); // Common fallback if not using a better state manager
  }

  /**
   * Get a user's wallet or create one if it doesn't exist
   * @param userId The user's unique ID from OAuth
   * @param token The user's auth token
   * @returns The user's wallet information
   */
  async getOrCreateUserWallet(userId: string, token?: string): Promise<StoredWallet> {
    const authToken = token || await this.getAuthToken();
    
    // Check if the user already has a wallet in the backend
    try {
      const response = await fetch(`${this.apiUrl}/user/wallet`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
    } catch (error) {
      console.warn("Failed to fetch existing wallet from API, will try to create one");
    }

    // Create a new wallet for the user locally (EOA + Smart Account derivation)
    const newWallet = await this.walletService.createWalletForUser(userId);

    // Store the wallet information in the backend
    const storedWallet: StoredWallet = {
      userId: newWallet.userId,
      address: newWallet.address,
      smartAccountAddress: newWallet.smartAccountAddress,
    };

    await this.storeUserWallet(storedWallet, authToken);

    return storedWallet;
  }

  /**
   * Get a user's wallet from backend
   */
  async getUserWallet(userId: string, token?: string): Promise<StoredWallet | null> {
    const authToken = token || await this.getAuthToken();
    try {
      const response = await fetch(`${this.apiUrl}/user/wallet`, {
        headers: {
          'Authorization': `Bearer ${authToken}`
        }
      });
      
      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error("Failed to get user wallet from API:", error);
      return null;
    }
  }

  /**
   * Store a user's wallet information in backend
   */
  async storeUserWallet(wallet: StoredWallet, token?: string | null): Promise<void> {
    const authToken = token || await this.getAuthToken();
    try {
      const response = await fetch(`${this.apiUrl}/user/wallet`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`
        },
        body: JSON.stringify({
          eoaAddress: wallet.address,
          smartAccountAddress: wallet.smartAccountAddress,
          network: 'sepolia'
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Failed to store user wallet in API:", error);
      throw new Error("Failed to store user wallet");
    }
  }

  /**
   * Get a user's wallet balance
   */
  async getUserBalance(userId: string, token?: string): Promise<string> {
    const wallet = await this.getUserWallet(userId, token);

    if (!wallet) {
      throw new Error("User wallet not found");
    }

    return this.walletService.getBalance(wallet.smartAccountAddress);
  }

  /**
   * Securely store a user's private key
   * @param userId The user's unique ID
   * @param privateKey The private key to encrypt and store
   * @param password User password or secret to encrypt the key
   */
  async storePrivateKey(
    userId: string,
    privateKey: string,
    password: string,
  ): Promise<void> {
    try {
      // Get the user's wallet
      const wallet = await this.getUserWallet(userId);

      if (!wallet) {
        throw new Error("User wallet not found");
      }

      // Encrypt the private key using the password
      const encryptedKey = CryptoJS.AES.encrypt(
        privateKey,
        password,
      ).toString();

      // Update the wallet with the encrypted key
      wallet.encryptedKey = encryptedKey;

      // Store the updated wallet
      await this.storeUserWallet(wallet);
    } catch (error) {
      console.error("Failed to store private key:", error);
      throw new Error("Failed to store private key");
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
        throw new Error("User wallet or private key not found");
      }

      // Decrypt the private key
      const bytes = CryptoJS.AES.decrypt(wallet.encryptedKey, password);
      const privateKey = bytes.toString(CryptoJS.enc.Utf8);

      if (!privateKey) {
        throw new Error("Failed to decrypt private key - incorrect password");
      }

      return privateKey;
    } catch (error) {
      console.error("Failed to get private key:", error);
      throw new Error("Failed to get private key");
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
      const encryptedWithRecovery = CryptoJS.AES.encrypt(
        privateKey,
        recoveryKey,
      ).toString();

      // Store the recovery data - in production this should be in a secure database
      localStorage.setItem(
        `${this.recoveryKeyPrefix}${userId}`,
        encryptedWithRecovery,
      );

      return recoveryKey;
    } catch (error) {
      console.error("Failed to generate recovery key:", error);
      throw new Error("Failed to generate recovery key");
    }
  }

  /**
   * Recover a wallet using a recovery key
   * @param userId The user's unique ID
   * @param recoveryKey The recovery key
   * @param newPassword New password to set
   * @returns Whether recovery was successful
   */
  async recoverWallet(
    userId: string,
    recoveryKey: string,
    newPassword: string,
  ): Promise<boolean> {
    try {
      // Get the encrypted recovery data
      const encryptedData = localStorage.getItem(
        `${this.recoveryKeyPrefix}${userId}`,
      );

      if (!encryptedData) {
        throw new Error("No recovery data found for user");
      }

      // Decrypt the private key using the recovery key
      const bytes = CryptoJS.AES.decrypt(encryptedData, recoveryKey);
      const privateKey = bytes.toString(CryptoJS.enc.Utf8);

      if (!privateKey) {
        throw new Error("Failed to decrypt with recovery key");
      }

      // Re-encrypt with the new password and store
      await this.storePrivateKey(userId, privateKey, newPassword);

      return true;
    } catch (error) {
      console.error("Failed to recover wallet:", error);
      return false;
    }
  }
}
