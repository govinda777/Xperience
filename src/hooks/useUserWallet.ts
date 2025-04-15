import { useState, useEffect, useCallback } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { UserWalletService } from '../services/userWalletService';
import { WalletService } from '../services/walletService';

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
  const { user, isAuthenticated, getAccessTokenSilently } = useAuth0();
  const [walletData, setWalletData] = useState<WalletData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const userWalletService = new UserWalletService();
  const walletService = new WalletService();

  /**
   * Initialize the user's wallet
   */
  const initializeWallet = useCallback(async () => {
    if (!isAuthenticated || !user?.sub) {
      setWalletData(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get or create the user's wallet
      const wallet = await userWalletService.getOrCreateUserWallet(user.sub);
      
      // Get the wallet balance
      const balance = await walletService.getBalance(wallet.smartAccountAddress);
      
      // Update the wallet data state
      setWalletData({
        address: wallet.address,
        smartAccountAddress: wallet.smartAccountAddress,
        balance,
      });
    } catch (err) {
      console.error('Failed to initialize wallet:', err);
      setError('Failed to initialize wallet');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.sub]);

  /**
   * Effect to initialize the wallet when the user's authentication state changes
   */
  useEffect(() => {
    initializeWallet();
  }, [initializeWallet]);

  /**
   * Send a transaction using the user's wallet
   */
  const sendTransaction = async (transaction: TransactionRequest): Promise<string> => {
    if (!isAuthenticated || !user?.sub || !walletData) {
      throw new Error('User not authenticated or wallet not initialized');
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get the user's wallet
      const wallet = await userWalletService.getUserWallet(user.sub);
      
      if (!wallet) {
        throw new Error('Wallet not found');
      }
      
      // Send the transaction
      const txHash = await walletService.sendTransaction(wallet, transaction);
      
      // Refresh the wallet balance
      const balance = await walletService.getBalance(wallet.smartAccountAddress);
      
      // Update the wallet data state
      setWalletData({
        ...walletData,
        balance,
      });
      
      return txHash;
    } catch (err) {
      console.error('Failed to send transaction:', err);
      setError('Failed to send transaction');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Refresh the wallet balance
   */
  const refreshBalance = async (): Promise<void> => {
    if (!isAuthenticated || !user?.sub || !walletData) {
      return;
    }

    try {
      const balance = await userWalletService.getUserBalance(user.sub);
      
      setWalletData({
        ...walletData,
        balance,
      });
    } catch (err) {
      console.error('Failed to refresh balance:', err);
      setError('Failed to refresh balance');
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