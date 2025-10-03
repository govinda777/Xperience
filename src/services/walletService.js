import { ethers } from "ethers";
import { Client, Presets } from "userop";
// Configuration
const RPC_URL = import.meta.env.VITE_RPC_URL || "";
const BUNDLER_URL = import.meta.env.VITE_BUNDLER_URL || "";
const ENTRYPOINT_ADDRESS = import.meta.env.VITE_ENTRYPOINT_ADDRESS || "";
const FACTORY_ADDRESS = import.meta.env.VITE_FACTORY_ADDRESS || "";
/**
 * Wallet Service - Handles ERC-4337 wallet operations
 */
export class WalletService {
    provider;
    client = null;
    constructor() {
        this.provider = new ethers.providers.JsonRpcProvider(RPC_URL);
        this.initClient();
    }
    /**
     * Initialize the UserOperation client
     */
    async initClient() {
        try {
            this.client = await Client.init(RPC_URL, {
                entryPoint: ENTRYPOINT_ADDRESS,
                overrideBundlerRpc: BUNDLER_URL,
            });
        }
        catch (error) {
            console.error("Failed to initialize Client:", error);
        }
    }
    /**
     * Create a new smart account wallet for a user
     * @param userId The unique ID of the user from OAuth
     * @returns The created wallet information
     */
    async createWalletForUser(userId) {
        try {
            // Generate a random signer for the user
            const signer = ethers.Wallet.createRandom().connect(this.provider);
            // Create a SimpleAccount using the Presets
            const simpleAccount = await Presets.Builder.SimpleAccount.init(signer, RPC_URL, { entryPoint: ENTRYPOINT_ADDRESS, factory: FACTORY_ADDRESS });
            // Get the address, TypeScript may not recognize getAddress() directly
            const smartAccountAddress = await simpleAccount.getSender();
            // Return the wallet information
            return {
                address: signer.address,
                userId,
                smartAccountAddress,
            };
        }
        catch (error) {
            console.error("Failed to create wallet:", error);
            throw new Error("Failed to create wallet");
        }
    }
    /**
     * Send a transaction using the user's smart account
     * @param userWallet The user's wallet information
     * @param transaction The transaction to send
     * @returns Transaction hash
     */
    async sendTransaction(userWallet, transaction) {
        try {
            if (!this.client) {
                await this.initClient();
                if (!this.client) {
                    throw new Error("Client not initialized");
                }
            }
            // Recover the signer - in a real implementation, this would use a securely stored private key
            // For demo purposes only - in production you would use a proper key management system
            const signer = new ethers.Wallet(userWallet.address).connect(this.provider);
            // Create the SimpleAccount instance
            const simpleAccount = await Presets.Builder.SimpleAccount.init(signer, RPC_URL, { entryPoint: ENTRYPOINT_ADDRESS, factory: FACTORY_ADDRESS });
            // Verify the account address matches
            const accountAddress = await simpleAccount.getSender();
            if (accountAddress.toLowerCase() !==
                userWallet.smartAccountAddress.toLowerCase()) {
                throw new Error("Account address mismatch");
            }
            // Prepare the transaction data
            const callData = transaction.data || "0x";
            // Create a UserOperation
            const userOp = simpleAccount.execute(transaction.to, transaction.value, callData);
            // Send the UserOperation
            const result = await this.client.sendUserOperation(userOp);
            const userOpReceipt = await result.wait();
            return userOpReceipt?.transactionHash || "";
        }
        catch (error) {
            console.error("Failed to send transaction:", error);
            throw new Error("Failed to send transaction");
        }
    }
    /**
     * Get the balance of a user's smart account
     * @param smartAccountAddress The address of the user's smart account
     * @returns The balance in ETH
     */
    async getBalance(smartAccountAddress) {
        try {
            const balance = await this.provider.getBalance(smartAccountAddress);
            return ethers.utils.formatEther(balance);
        }
        catch (error) {
            console.error("Failed to get balance:", error);
            throw new Error("Failed to get balance");
        }
    }
    /**
     * Sign a message using the user's account
     * @param message The message to sign
     * @param privateKey The private key to sign with
     * @returns The signature
     */
    async signMessage(message, privateKey) {
        try {
            const wallet = new ethers.Wallet(privateKey);
            return await wallet.signMessage(message);
        }
        catch (error) {
            console.error("Failed to sign message:", error);
            throw new Error("Failed to sign message");
        }
    }
}
