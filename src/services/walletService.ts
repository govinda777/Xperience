import { ethers } from 'ethers';
import { Client, Presets } from 'userop';

// Interfaces
interface UserWallet {
  address: string;
  userId: string;
  smartAccountAddress: string;
}

interface TransactionRequest {
  to: string;
  value: string;
  data?: string;
}

// Configuration
const RPC_URL = import.meta.env.VITE_RPC_URL || '';
const BUNDLER_URL = import.meta.env.VITE_BUNDLER_URL || '';
const ENTRYPOINT_ADDRESS = import.meta.env.VITE_ENTRYPOINT_ADDRESS || '';
const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS || '';

/**
 * Wallet Service - Handles ERC-4337 wallet operations
 */
export class WalletService {
  private provider: ethers.providers.JsonRpcProvider;
  private client: Client | null = null;

  constructor() {
    this.provider = new ethers.providers.JsonRpcProvider(RPC_URL);
    this.initClient();
  }

  /**
   * Initialize the UserOperation client
   */
  private async initClient(): Promise<void> {
    try {
      this.client = await Client.init(RPC_URL, {
        entryPoint: ENTRYPOINT_ADDRESS,
        overrideBundlerRpc: BUNDLER_URL,
      });
    } catch (error) {
      console.error('Failed to initialize Client:', error);
    }
  }

  /**
   * Create a new smart account wallet for a user
   * @param userId The unique ID of the user from OAuth
   * @returns The created wallet information
   */
  async createWalletForUser(userId: string): Promise<UserWallet> {
    try {
      // Generate a random signer for the user
      const signer = ethers.Wallet.createRandom().connect(this.provider);
      
      // Create a SimpleAccount using the Presets
      const simpleAccount = await Presets.Builder.SimpleAccount.init(
        signer,
        RPC_URL,
        { entryPoint: ENTRYPOINT_ADDRESS, factory: FACTORY_ADDRESS }
      );

      // Get the address, TypeScript may not recognize getAddress() directly
      const smartAccountAddress = await simpleAccount.getSender();
      
      // Return the wallet information
      return {
        address: signer.address,
        userId,
        smartAccountAddress,
      };
    } catch (error) {
      console.error('Failed to create wallet:', error);
      throw new Error('Failed to create wallet');
    }
  }

  /**
   * Send a transaction using the user's smart account
   * @param userWallet The user's wallet information
   * @param transaction The transaction to send
   * @returns Transaction hash
   */
  async sendTransaction(userWallet: UserWallet, transaction: TransactionRequest): Promise<string> {
    try {
      if (!this.client) {
        throw new Error('Client not initialized');
      }

      // Implement transaction sending with ERC-4337
      // This is a placeholder for the actual implementation
      
      return 'transaction_hash_placeholder';
    } catch (error) {
      console.error('Failed to send transaction:', error);
      throw new Error('Failed to send transaction');
    }
  }

  /**
   * Get the balance of a user's smart account
   * @param smartAccountAddress The address of the user's smart account
   * @returns The balance in ETH
   */
  async getBalance(smartAccountAddress: string): Promise<string> {
    try {
      const balance = await this.provider.getBalance(smartAccountAddress);
      return ethers.utils.formatEther(balance);
    } catch (error) {
      console.error('Failed to get balance:', error);
      throw new Error('Failed to get balance');
    }
  }

  /**
   * Sign a message using the user's account
   * @param message The message to sign
   * @param privateKey The private key to sign with
   * @returns The signature
   */
  async signMessage(message: string, privateKey: string): Promise<string> {
    try {
      const wallet = new ethers.Wallet(privateKey);
      return await wallet.signMessage(message);
    } catch (error) {
      console.error('Failed to sign message:', error);
      throw new Error('Failed to sign message');
    }
  }
} 