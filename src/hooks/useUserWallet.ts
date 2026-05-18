import { useState, useEffect, useCallback, useMemo } from "react";
import { useAuth } from "../contexts/AuthContext";
import { UserWalletService } from "../services/userWalletService";
import { usePrivy } from "@privy-io/react-auth";
import { WalletService } from "../services/walletService";
import { ethers } from "ethers";

// Interface for transaction request
interface TransactionRequest {
  to: string;
  value: string;
  data?: string;
}

// Interface for the wallet data
interface WalletData {
  address: string;
  smartAccountAddress: string;
  balance: string;
}

/**
 * Hook to interact with user's ERC-4337 wallet
 */
export const useUserWallet = () => {
  const { user, authenticated, wallets } = usePrivy();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const userWalletService = useMemo(() => new UserWalletService(), []);
  const walletService = useMemo(() => new WalletService(), []);

  // Get the embedded wallet from Privy
  const embeddedWallet = (wallets as any[]).find((w) => w.walletClientType === 'privy');

  /**
   * Initialize the user's wallet
   */
  const initializeWallet = useCallback(async () => {
    if (!authenticated || !user?.id) {
      setWalletData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the auth token (in a real app, this should be handled by AuthContext)
      const token = localStorage.getItem('privy_token') || "";

      // Get or create the user's wallet mapping from backend
      const wallet = await userWalletService.getOrCreateUserWallet(user.id, token);

      // Get the wallet balance
      const balance = await walletService.getBalance(
        wallet.smartAccountAddress,
      );

      // Update the wallet data state
      setWalletData({
        address: wallet.address,
        smartAccountAddress: wallet.smartAccountAddress,
        balance,
      });
    } catch (err) {
      console.error("Failed to initialize wallet:", err);
      setError("Failed to initialize wallet");
    } finally {
      setIsLoading(false);
    }
  }, [authenticated, user?.id, userWalletService, walletService]);

  /**
   * Effect to initialize the wallet when the user's authentication state changes
   */
  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  /**
   * Send a transaction using the user's wallet
   */
  const sendTransaction = async (
    transaction: TransactionRequest,
  ): Promise<string> => {
    if (!authenticated || !user?.id || !walletData || !embeddedWallet) {
      throw new Error("User not authenticated, wallet not initialized, or no embedded wallet found");
    }

    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('privy_token') || "";

      // Get the signer from Privy's embedded wallet
      const privyProvider = await embeddedWallet.getEthersProvider();
      const signer = privyProvider.getSigner();

      // Get the user's wallet mapping
      const wallet = await userWalletService.getUserWallet(user.id, token);

      if (!wallet) {
        throw new Error("Wallet mapping not found");
      }

      // Send the transaction using the smart account
      const txHash = await walletService.sendTransaction(signer, wallet, transaction);

      // Refresh the wallet balance
      const balance = await walletService.getBalance(
        wallet.smartAccountAddress,
      );

      // Update the wallet data state
      setWalletData({
        ...walletData,
        balance,
      });

      return txHash;
    } catch (err) {
      console.error("Failed to send transaction:", err);
      setError("Failed to send transaction");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh the wallet balance
   */
  const refreshBalance = async (): Promise<void> => {
    if (!authenticated || !user?.id || !walletData) {
      return;
    }

    try {
      const balance = await userWalletService.getUserBalance(user.id);

      setWalletData({
        ...walletData,
        balance,
      });
    } catch (err) {
      console.error("Failed to refresh balance:", err);
      setError("Failed to refresh balance");
    }
  };

  return {
    walletData,
    isLoading,
    error,
    sendTransaction,
    refreshBalance,
    initializeWallet,
  };
};
