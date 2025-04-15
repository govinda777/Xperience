import { ethers } from 'ethers';
import { Client, Presets, UserOperationBuilder } from 'userop';

// ERC-4337 configuration
const RPC_URL = import.meta.env.VITE_RPC_URL || '';
const BUNDLER_URL = import.meta.env.VITE_BUNDLER_URL || '';
const ENTRYPOINT_ADDRESS = import.meta.env.VITE_ENTRYPOINT_ADDRESS || '';
const PAYMASTER_URL = import.meta.env.VITE_PAYMASTER_URL || '';

/**
 * Account Abstraction Service
 * Handles ERC-4337 operations and client integration
 */
class AccountAbstractionService {
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
      console.error('Failed to initialize ERC-4337 client:', error);
    }
  }
  
  /**
   * Create a SimpleAccount for a user
   * @param signer Ethereum signer
   * @param factoryAddress Address of the account factory
   * @returns SimpleAccount instance
   */
  async createSimpleAccount(
    signer: ethers.Signer,
    factoryAddress: string
  ): Promise<Presets.Builder.SimpleAccount> {
    try {
      return await Presets.Builder.SimpleAccount.init(
        signer,
        RPC_URL,
        { 
          entryPoint: ENTRYPOINT_ADDRESS,
          factory: factoryAddress,
        }
      );
    } catch (error) {
      console.error('Failed to create SimpleAccount:', error);
      throw new Error('Failed to create SimpleAccount');
    }
  }
  
  /**
   * Build and send a UserOperation
   * @param account The SimpleAccount to send from
   * @param target Target address
   * @param data Call data
   * @param value Value to send (in wei)
   * @param usePaymaster Whether to use a paymaster for gas sponsorship
   * @returns Transaction hash
   */
  async sendUserOperation(
    account: Presets.Builder.SimpleAccount,
    target: string,
    data: string,
    value: string,
    usePaymaster: boolean = false
  ): Promise<string> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    
    try {
      // Create the transaction object
      const builder = account.executeBatch(
        [target],
        [value],
        [data]
      );
      
      // Add a paymaster if requested (gasless transaction)
      if (usePaymaster && PAYMASTER_URL) {
        const paymaster = new Presets.Middleware.VerifyingPaymaster(
          PAYMASTER_URL,
          { type: 'payg' }
        );
        
        // Apply the paymaster middleware
        builder.middleware(paymaster);
      }
      
      // Build and send the user operation
      const response = await this.client.sendUserOperation(builder);
      
      // Wait for the transaction to be included in a block
      const userOpReceipt = await response.wait();
      
      // Return the transaction hash
      return userOpReceipt.transactionHash;
    } catch (error) {
      console.error('Failed to send UserOperation:', error);
      throw new Error('Failed to send UserOperation');
    }
  }
  
  /**
   * Get the counterfactual address for an account before deployment
   * @param signer Ethereum signer
   * @param factoryAddress Address of the account factory
   * @returns The counterfactual address
   */
  async getCounterfactualAddress(
    signer: ethers.Signer,
    factoryAddress: string
  ): Promise<string> {
    try {
      const account = await this.createSimpleAccount(signer, factoryAddress);
      return await account.getAddress();
    } catch (error) {
      console.error('Failed to get counterfactual address:', error);
      throw new Error('Failed to get counterfactual address');
    }
  }
  
  /**
   * Estimate gas for a UserOperation
   * @param account The SimpleAccount instance
   * @param target Target address
   * @param data Call data
   * @param value Value to send (in wei)
   * @returns Estimated gas
   */
  async estimateUserOperationGas(
    account: Presets.Builder.SimpleAccount,
    target: string,
    data: string,
    value: string
  ): Promise<{
    preVerificationGas: string;
    verificationGas: string;
    callGasLimit: string;
  }> {
    if (!this.client) {
      throw new Error('Client not initialized');
    }
    
    try {
      // Create the transaction object
      const builder = account.executeBatch(
        [target],
        [value],
        [data]
      );
      
      // Estimate gas
      const gas = await this.client.estimateUserOperationGas(
        builder.getOp()
      );
      
      return {
        preVerificationGas: gas.preVerificationGas.toString(),
        verificationGas: gas.verificationGasLimit.toString(),
        callGasLimit: gas.callGasLimit.toString(),
      };
    } catch (error) {
      console.error('Failed to estimate UserOperation gas:', error);
      throw new Error('Failed to estimate UserOperation gas');
    }
  }
}

// Export as singleton
export const accountAbstraction = new AccountAbstractionService(); 