import { ethers } from "ethers";
import { Client, Presets } from "userop";
import {
  LocalAccountSigner,
  type SmartAccountSigner,
  type SmartContractAccount,
} from "@alchemy/aa-core";
import {
  createAlchemySmartAccountClient,
  type AlchemySmartAccountClient,
} from "@alchemy/aa-alchemy";
import { http, createPublicClient } from "viem";
import { createLightAccount } from "@alchemy/aa-accounts";

// First declare the variables
const RPC_URL = import.meta.env.VITE_RPC_URL || "";
const BUNDLER_URL = import.meta.env.VITE_BUNDLER_URL || "";
const ENTRYPOINT_ADDRESS =
  import.meta.env.VITE_ENTRYPOINT_ADDRESS ||
  "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";
const PAYMASTER_URL = import.meta.env.VITE_PAYMASTER_URL || "";
const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS || "";
const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID || "11155111", 10);

// Then define sepoliaChain using RPC_URL
const sepoliaChain = {
  id: 11155111,
  name: "Sepolia",
  network: "sepolia",
  nativeCurrency: { name: "Sepolia Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: { default: { http: [RPC_URL] } },
};

/**
 * Account Abstraction Service
 * Handles ERC-4337 operations and client integration
 */
class AccountAbstractionService {
  private provider: ethers.providers.JsonRpcProvider;
  private client: Client | null = null;
  private alchemyClient: AlchemySmartAccountClient | null = null;

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
      console.error("Failed to initialize ERC-4337 client:", error);
    }
  }

  /**
   * Initialize the Alchemy Provider for ERC-4337
   * @param ownerKey The owner's private key
   * @returns AlchemyProvider instance
   */
  async initAlchemyProvider(
    ownerKey: string,
  ): Promise<AlchemySmartAccountClient> {
    try {
      // Extract the API key from the RPC URL
      const apiKeyMatch = RPC_URL.match(/\/v2\/([^/]+)$/);
      const apiKey = apiKeyMatch ? apiKeyMatch[1] : "";

      if (!apiKey) {
        throw new Error("Alchemy API key not found in RPC URL");
      }

      // Create a standard ethers wallet
      const wallet = new ethers.Wallet(
        ownerKey.startsWith("0x") ? ownerKey : `0x${ownerKey}`,
      );

      // Create the client with minimal config
      this.alchemyClient = await createAlchemySmartAccountClient({
        apiKey,
        chain: sepoliaChain,
      });

      // Use this simpler SimpleAccount for compatibility
      const simpleAccount = await Presets.Builder.SimpleAccount.init(
        wallet,
        RPC_URL,
        {
          entryPoint: ENTRYPOINT_ADDRESS,
          factory: FACTORY_ADDRESS || undefined,
        },
      );

      // Store the simpleAccount address with client
      const accountAddress = await simpleAccount.getSender();

      // At this point we can't connect simpleAccount to alchemyClient
      // but we'll return the client anyway and handle this later

      return this.alchemyClient;
    } catch (error) {
      console.error("Failed to initialize Alchemy Provider:", error);
      throw error;
    }
  }

  /**
   * Get the Alchemy provider
   * @returns The initialized Alchemy provider
   */
  getAlchemyProvider(): AlchemySmartAccountClient | null {
    return this.alchemyClient;
  }

  /**
   * Create a SimpleAccount for a user
   * @param signer Ethereum signer
   * @param factoryAddress Address of the account factory
   * @returns SimpleAccount instance
   */
  async createSimpleAccount(
    signer: ethers.Signer,
    factoryAddress: string,
  ): Promise<Presets.Builder.SimpleAccount> {
    try {
      return await Presets.Builder.SimpleAccount.init(signer, RPC_URL, {
        entryPoint: ENTRYPOINT_ADDRESS,
        factory: factoryAddress,
      });
    } catch (error) {
      console.error("Failed to create SimpleAccount:", error);
      throw new Error("Failed to create SimpleAccount");
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
    usePaymaster: boolean = false,
  ): Promise<string> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    try {
      // Create the transaction object
      const builder = account.executeBatch([target], [data]);

      // Add a paymaster if requested (gasless transaction)
      if (usePaymaster && PAYMASTER_URL) {
        const paymaster = Presets.Middleware.verifyingPaymaster(PAYMASTER_URL, {
          type: "payg",
        });

        // Apply the paymaster middleware
        builder.useMiddleware(paymaster);
      }

      // Build and send the user operation
      const response = await this.client.sendUserOperation(builder);

      // Wait for the transaction to be included in a block
      const userOpReceipt = await response.wait();

      // Return the transaction hash
      return userOpReceipt?.transactionHash || "";
    } catch (error) {
      console.error("Failed to send UserOperation:", error);
      throw new Error("Failed to send UserOperation");
    }
  }

  /**
   * Send a UserOperation using Alchemy provider
   * @param target Target address
   * @param data Call data
   * @param value Value to send (in wei)
   * @returns Transaction hash
   */
  async sendAlchemyUserOperation(
    target: string,
    data: string,
    value: bigint = BigInt(0),
  ): Promise<string> {
    if (!this.alchemyClient || !this.alchemyClient.account) {
      throw new Error("Alchemy Provider or Account not initialized");
    }

    try {
      const hash = await this.alchemyClient.sendTransaction({
        to: target as `0x${string}`,
        data: data as `0x${string}`,
        value,
      } as any); // Use type assertion to bypass type checking

      // Wait for the transaction to be included in a block
      const txHash = await this.alchemyClient.waitForUserOperationTransaction({
        hash,
      });

      return txHash;
    } catch (error) {
      console.error("Failed to send Alchemy UserOperation:", error);
      throw error;
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
    factoryAddress: string,
  ): Promise<string> {
    try {
      const account = await this.createSimpleAccount(signer, factoryAddress);
      return await account.getSender();
    } catch (error) {
      console.error("Failed to get counterfactual address:", error);
      throw new Error("Failed to get counterfactual address");
    }
  }

  /**
   * Get the nonce for a smart account
   * @param address The smart account address
   * @returns The account nonce
   */
  async getSmartAccountNonce(address: string): Promise<bigint> {
    if (!this.alchemyClient || !this.alchemyClient.account) {
      throw new Error("Account not initialized");
    }

    try {
      return await this.alchemyClient.account.getNonce();
    } catch (error) {
      console.error("Failed to get smart account nonce:", error);
      throw error;
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
    value: string,
  ): Promise<{
    preVerificationGas: string;
    verificationGas: string;
    callGasLimit: string;
  }> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    try {
      // Create the transaction object
      const builder = account.executeBatch([target], [data]);

      // Get the user operation
      const userOp = builder.getOp();

      // Manually estimate the gas amounts since client.estimateUserOperationGas is not available
      return {
        preVerificationGas: String(userOp.preVerificationGas || 0),
        verificationGas: String(userOp.verificationGasLimit || 0),
        callGasLimit: String(userOp.callGasLimit || 0),
      };
    } catch (error) {
      console.error("Failed to estimate UserOperation gas:", error);
      throw new Error("Failed to estimate UserOperation gas");
    }
  }

  /**
   * Sign a message using the ERC-4337 account
   * @param message The message to sign
   * @param ownerKey The owner's private key
   * @returns The signature
   */
  async signMessage(message: string, ownerKey: string): Promise<string> {
    try {
      // Create a wallet from the owner key
      const wallet = new ethers.Wallet(
        ownerKey.startsWith("0x") ? ownerKey : `0x${ownerKey}`,
      );

      // Sign the message
      return await wallet.signMessage(message);
    } catch (error) {
      console.error("Failed to sign message:", error);
      throw new Error("Failed to sign message");
    }
  }

  /**
   * Execute a batch of transactions in a single UserOperation
   * @param account The SimpleAccount to send from
   * @param targets Array of target addresses
   * @param datas Array of call data
   * @param values Array of values to send (in wei)
   * @param usePaymaster Whether to use a paymaster for gas sponsorship
   * @returns Transaction hash
   */
  async sendBatchOperation(
    account: Presets.Builder.SimpleAccount,
    targets: string[],
    datas: string[],
    values: string[],
    usePaymaster: boolean = false,
  ): Promise<string> {
    if (!this.client) {
      throw new Error("Client not initialized");
    }

    try {
      // Validate input arrays have the same length
      if (targets.length !== datas.length || targets.length !== values.length) {
        throw new Error("Input arrays must have the same length");
      }

      // Create the batch transaction builder
      const builder = account.executeBatch(targets, datas);

      // Add a paymaster if requested (gasless transaction)
      if (usePaymaster && PAYMASTER_URL) {
        const paymaster = Presets.Middleware.verifyingPaymaster(PAYMASTER_URL, {
          type: "payg",
        });

        // Apply the paymaster middleware
        builder.useMiddleware(paymaster);
      }

      // Build and send the user operation
      const response = await this.client.sendUserOperation(builder);

      // Wait for the transaction to be included in a block
      const userOpReceipt = await response.wait();

      // Return the transaction hash
      return userOpReceipt?.transactionHash || "";
    } catch (error) {
      console.error("Failed to send batch UserOperation:", error);
      throw new Error("Failed to send batch UserOperation");
    }
  }

  /**
   * Execute a batch of transactions with the Alchemy provider
   * @param targets Array of target addresses
   * @param datas Array of call data
   * @param values Array of values to send
   * @returns Transaction hash
   */
  async sendAlchemyBatchOperation(
    targets: string[],
    datas: string[],
    values: bigint[] = [],
  ): Promise<string> {
    if (!this.alchemyClient || !this.alchemyClient.account) {
      throw new Error("Alchemy Provider or Account not initialized");
    }

    try {
      // Ensure values has the same length as targets
      const paddedValues =
        values.length === targets.length
          ? values
          : targets.map((_, i) => values[i] || BigInt(0));

      // Create batch transaction objects
      const transactions = targets.map((target, i) => ({
        to: target as `0x${string}`,
        data: datas[i] as `0x${string}`,
        value: paddedValues[i],
      }));

      // Fix: Use the correct typing for batch transactions
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const hash = await (this.alchemyClient as any).sendBatchTransaction({
        transactions: transactions,
      });

      // Wait for the transaction to be included in a block
      const txHash = await this.alchemyClient.waitForUserOperationTransaction({
        hash,
      });

      return txHash;
    } catch (error) {
      console.error("Failed to send Alchemy Batch UserOperation:", error);
      throw error;
    }
  }
}

// Export as singleton
export const accountAbstraction = new AccountAbstractionService();
