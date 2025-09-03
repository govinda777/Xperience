// Mock dependencies
const usePrivy = jest.fn();
const mockUserWalletService = {
  getOrCreateUserWallet: jest.fn(),
  getUserWallet: jest.fn(),
  getUserBalance: jest.fn(),
};
const mockWalletService = {
  getBalance: jest.fn(),
  sendTransaction: jest.fn(),
};

jest.mock('@privy-io/react-auth', () => ({
  usePrivy,
}));
jest.mock('../../services/userWalletService', () => ({
  UserWalletService: jest.fn(() => mockUserWalletService),
}));
jest.mock('../../services/walletService', () => ({
  WalletService: jest.fn(() => mockWalletService),
}));

import { renderHook, act } from '@testing-library/react';
import { useUserWallet } from '../../hooks/useUserWallet';
jest.mock('../../services/userWalletService');
jest.mock('../../services/walletService');

describe('useUserWallet', () => {
  const mockUserId = 'test-user-id';
  const mockWalletAddress = '0x123';
  const mockSmartAccountAddress = '0x456';
  const mockBalance = '1000000000000000000'; // 1 ETH
  const mockTxHash = '0x789';

  const mockWallet = {
    address: mockWalletAddress,
    smartAccountAddress: mockSmartAccountAddress,
  };

  const mockTransaction = {
    to: '0xabc',
    value: '1000000000000000000',
    data: '0x',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock usePrivy
    usePrivy.mockReturnValue({
      user: { id: mockUserId },
      authenticated: true,
    });

    // Mock UserWalletService
    mockUserWalletService.getOrCreateUserWallet.mockResolvedValue(mockWallet);
    mockUserWalletService.getUserWallet.mockResolvedValue(mockWallet);
    mockUserWalletService.getUserBalance.mockResolvedValue(mockBalance);

    // Mock WalletService
    mockWalletService.getBalance.mockResolvedValue(mockBalance);
    mockWalletService.sendTransaction.mockResolvedValue(mockTxHash);
  });

  it('should initialize wallet when authenticated', async () => {
    const { result } = renderHook(() => useUserWallet());

    // Initial state
    expect(result.current.isLoading).toBe(true);
    expect(result.current.error).toBeNull();
    expect(result.current.walletData).toBeNull();

    // Wait for initialization
    await act(async () => {
      await Promise.resolve();
    });

    // Final state
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.walletData).toEqual({
      address: mockWalletAddress,
      smartAccountAddress: mockSmartAccountAddress,
      balance: mockBalance,
    });

    expect(mockUserWalletService.getOrCreateUserWallet).toHaveBeenCalledWith(mockUserId);
    expect(mockWalletService.getBalance).toHaveBeenCalledWith(mockSmartAccountAddress);
  });

  it('should not initialize wallet when not authenticated', async () => {
    (usePrivy as jest.Mock).mockReturnValue({
      user: null,
      authenticated: false,
    });

    const { result } = renderHook(() => useUserWallet());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.walletData).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();

    expect(mockUserWalletService.getOrCreateUserWallet).not.toHaveBeenCalled();
    expect(mockWalletService.getBalance).not.toHaveBeenCalled();
  });

  it('should handle initialization error', async () => {
    const error = new Error('Failed to initialize');
    mockUserWalletService.getOrCreateUserWallet.mockRejectedValue(error);

    const { result } = renderHook(() => useUserWallet());

    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current.walletData).toBeNull();
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to initialize wallet');
  });

  it('should send transaction successfully', async () => {
    const { result } = renderHook(() => useUserWallet());

    // Wait for initialization
    await act(async () => {
      await Promise.resolve();
    });

    let txHash: string | undefined;

    await act(async () => {
      txHash = await result.current.sendTransaction(mockTransaction);
    });

    expect(txHash).toBe(mockTxHash);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.walletData?.balance).toBe(mockBalance);

    expect(mockUserWalletService.getUserWallet).toHaveBeenCalledWith(mockUserId);
    expect(mockWalletService.sendTransaction).toHaveBeenCalledWith(mockWallet, mockTransaction);
    expect(mockWalletService.getBalance).toHaveBeenCalledWith(mockSmartAccountAddress);
  });

  it('should handle transaction error', async () => {
    const error = new Error('Transaction failed');
    mockWalletService.sendTransaction.mockRejectedValue(error);

    const { result } = renderHook(() => useUserWallet());

    // Wait for initialization
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await expect(result.current.sendTransaction(mockTransaction)).rejects.toThrow(error);
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe('Failed to send transaction');
  });

  it('should not send transaction when not authenticated', async () => {
    (usePrivy as jest.Mock).mockReturnValue({
      user: null,
      authenticated: false,
    });

    const { result } = renderHook(() => useUserWallet());

    await act(async () => {
      await expect(result.current.sendTransaction(mockTransaction)).rejects.toThrow(
        'User not authenticated or wallet not initialized'
      );
    });
  });

  it('should not send transaction when wallet not found', async () => {
    mockUserWalletService.getUserWallet.mockResolvedValue(null);

    const { result } = renderHook(() => useUserWallet());

    // Wait for initialization
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await expect(result.current.sendTransaction(mockTransaction)).rejects.toThrow(
        'Wallet not found'
      );
    });
  });

  it('should refresh balance successfully', async () => {
    const newBalance = '2000000000000000000'; // 2 ETH
    mockUserWalletService.getUserBalance.mockResolvedValue(newBalance);

    const { result } = renderHook(() => useUserWallet());

    // Wait for initialization
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.refreshBalance();
    });

    expect(result.current.walletData?.balance).toBe(newBalance);
    expect(result.current.error).toBeNull();
    expect(mockUserWalletService.getUserBalance).toHaveBeenCalledWith(mockUserId);
  });

  it('should handle refresh balance error', async () => {
    const error = new Error('Failed to refresh');
    mockUserWalletService.getUserBalance.mockRejectedValue(error);

    const { result } = renderHook(() => useUserWallet());

    // Wait for initialization
    await act(async () => {
      await Promise.resolve();
    });

    await act(async () => {
      await result.current.refreshBalance();
    });

    expect(result.current.error).toBe('Failed to refresh balance');
  });

  it('should not refresh balance when not authenticated', async () => {
    (usePrivy as jest.Mock).mockReturnValue({
      user: null,
      authenticated: false,
    });

    const { result } = renderHook(() => useUserWallet());

    await act(async () => {
      await result.current.refreshBalance();
    });

    expect(mockUserWalletService.getUserBalance).not.toHaveBeenCalled();
  });

  it('should reinitialize wallet when user changes', async () => {
    const { result, rerender } = renderHook(() => useUserWallet());

    // Wait for initial initialization
    await act(async () => {
      await Promise.resolve();
    });

    // Change user
    const newUserId = 'new-user-id';
    (usePrivy as jest.Mock).mockReturnValue({
      user: { id: newUserId },
      authenticated: true,
    });

    // Rerender hook
    rerender();

    // Wait for reinitialization
    await act(async () => {
      await Promise.resolve();
    });

    expect(mockUserWalletService.getOrCreateUserWallet).toHaveBeenCalledWith(newUserId);
  });
});
