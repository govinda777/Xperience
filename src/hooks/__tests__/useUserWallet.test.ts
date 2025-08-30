import { renderHook, act, waitFor } from '@testing-library/react';
import { useAuth0 } from '@auth0/auth0-react';
import { useUserWallet } from '../useUserWallet';
import { UserWalletService } from '../../services/userWalletService';
import { WalletService } from '../../services/walletService';

// Mock Auth0
jest.mock('@auth0/auth0-react');

// Mock services
jest.mock('../../services/userWalletService');
jest.mock('../../services/walletService');

const mockUseAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;
const MockUserWalletService = UserWalletService as jest.MockedClass<typeof UserWalletService>;
const MockWalletService = WalletService as jest.MockedClass<typeof WalletService>;

describe('useUserWallet', () => {
  let mockUserWalletService: jest.Mocked<UserWalletService>;
  let mockWalletService: jest.Mocked<WalletService>;

  beforeEach(() => {
    mockUserWalletService = {
      getOrCreateUserWallet: jest.fn(),
      getUserWallet: jest.fn(),
      getUserBalance: jest.fn(),
    } as any;

    mockWalletService = {
      getBalance: jest.fn(),
      sendTransaction: jest.fn(),
    } as any;

    MockUserWalletService.mockImplementation(() => mockUserWalletService);
    MockWalletService.mockImplementation(() => mockWalletService);

    jest.clearAllMocks();
  });

  describe('Initialization', () => {
    it('should initialize with default values', () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: jest.fn(),
      } as any);

      const { result } = renderHook(() => useUserWallet());

      expect(result.current.walletData).toBeNull();
      expect(result.current.isLoading).toBe(false);
      expect(result.current.error).toBeNull();
    });

    it('should not initialize wallet when user is not authenticated', () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: jest.fn(),
      } as any);

      renderHook(() => useUserWallet());

      expect(mockUserWalletService.getOrCreateUserWallet).not.toHaveBeenCalled();
    });

    it('should initialize wallet when user is authenticated', async () => {
      const mockUser = { sub: 'user-123' };
      const mockWallet = {
        address: '0x123',
        smartAccountAddress: '0x456',
      };

      mockUseAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        getAccessTokenSilently: jest.fn(),
      } as any);

      mockUserWalletService.getOrCreateUserWallet.mockResolvedValue(mockWallet);
      mockWalletService.getBalance.mockResolvedValue('1.5');

      const { result } = renderHook(() => useUserWallet());

      await waitFor(() => {
        expect(result.current.walletData).toEqual({
          address: '0x123',
          smartAccountAddress: '0x456',
          balance: '1.5',
        });
      });

      expect(mockUserWalletService.getOrCreateUserWallet).toHaveBeenCalledWith('user-123');
      expect(mockWalletService.getBalance).toHaveBeenCalledWith('0x456');
    });

    it('should handle initialization errors', async () => {
      const mockUser = { sub: 'user-123' };

      mockUseAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        getAccessTokenSilently: jest.fn(),
      } as any);

      mockUserWalletService.getOrCreateUserWallet.mockRejectedValue(
        new Error('Wallet creation failed')
      );

      const { result } = renderHook(() => useUserWallet());

      await waitFor(() => {
        expect(result.current.error).toBe('Failed to initialize wallet');
        expect(result.current.isLoading).toBe(false);
      });
    });
  });

  describe('Send Transaction', () => {
    const mockUser = { sub: 'user-123' };
    const mockWallet = {
      address: '0x123',
      smartAccountAddress: '0x456',
    };
    const mockTransaction = {
      to: '0x789',
      value: '1.0',
      data: '0x',
    };

    beforeEach(() => {
      mockUseAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        getAccessTokenSilently: jest.fn(),
      } as any);

      mockUserWalletService.getOrCreateUserWallet.mockResolvedValue(mockWallet);
      mockWalletService.getBalance.mockResolvedValue('1.5');
    });

    it('should send transaction successfully', async () => {
      mockUserWalletService.getUserWallet.mockResolvedValue(mockWallet);
      mockWalletService.sendTransaction.mockResolvedValue('0xhash123');
      mockWalletService.getBalance.mockResolvedValueOnce('1.5').mockResolvedValueOnce('0.5');

      const { result } = renderHook(() => useUserWallet());

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.walletData).not.toBeNull();
      });

      let txHash: string;
      await act(async () => {
        txHash = await result.current.sendTransaction(mockTransaction);
      });

      expect(txHash!).toBe('0xhash123');
      expect(mockWalletService.sendTransaction).toHaveBeenCalledWith(mockWallet, mockTransaction);
      expect(result.current.walletData?.balance).toBe('0.5');
    });

    it('should throw error when user is not authenticated', async () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: jest.fn(),
      } as any);

      const { result } = renderHook(() => useUserWallet());

      await act(async () => {
        await expect(result.current.sendTransaction(mockTransaction))
          .rejects.toThrow('User not authenticated or wallet not initialized');
      });
    });

    it('should throw error when wallet is not found', async () => {
      mockUserWalletService.getUserWallet.mockResolvedValue(null);

      const { result } = renderHook(() => useUserWallet());

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.walletData).not.toBeNull();
      });

      await act(async () => {
        await expect(result.current.sendTransaction(mockTransaction))
          .rejects.toThrow('Wallet not found');
      });
    });

    it('should handle transaction errors', async () => {
      mockUserWalletService.getUserWallet.mockResolvedValue(mockWallet);
      mockWalletService.sendTransaction.mockRejectedValue(new Error('Transaction failed'));

      const { result } = renderHook(() => useUserWallet());

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.walletData).not.toBeNull();
      });

      await act(async () => {
        await expect(result.current.sendTransaction(mockTransaction))
          .rejects.toThrow('Transaction failed');
      });

      expect(result.current.error).toBe('Failed to send transaction');
    });
  });

  describe('Refresh Balance', () => {
    const mockUser = { sub: 'user-123' };
    const mockWallet = {
      address: '0x123',
      smartAccountAddress: '0x456',
    };

    beforeEach(() => {
      mockUseAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        getAccessTokenSilently: jest.fn(),
      } as any);

      mockUserWalletService.getOrCreateUserWallet.mockResolvedValue(mockWallet);
      mockWalletService.getBalance.mockResolvedValue('1.5');
    });

    it('should refresh balance successfully', async () => {
      mockUserWalletService.getUserBalance.mockResolvedValue('2.0');

      const { result } = renderHook(() => useUserWallet());

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.walletData?.balance).toBe('1.5');
      });

      await act(async () => {
        await result.current.refreshBalance();
      });

      expect(result.current.walletData?.balance).toBe('2.0');
      expect(mockUserWalletService.getUserBalance).toHaveBeenCalledWith('user-123');
    });

    it('should not refresh when user is not authenticated', async () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: jest.fn(),
      } as any);

      const { result } = renderHook(() => useUserWallet());

      await act(async () => {
        await result.current.refreshBalance();
      });

      expect(mockUserWalletService.getUserBalance).not.toHaveBeenCalled();
    });

    it('should handle refresh errors', async () => {
      mockUserWalletService.getUserBalance.mockRejectedValue(
        new Error('Balance refresh failed')
      );

      const { result } = renderHook(() => useUserWallet());

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.walletData).not.toBeNull();
      });

      await act(async () => {
        await result.current.refreshBalance();
      });

      expect(result.current.error).toBe('Failed to refresh balance');
    });
  });

  describe('Manual Initialization', () => {
    it('should allow manual wallet initialization', async () => {
      const mockUser = { sub: 'user-123' };
      const mockWallet = {
        address: '0x123',
        smartAccountAddress: '0x456',
      };

      mockUseAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        getAccessTokenSilently: jest.fn(),
      } as any);

      mockUserWalletService.getOrCreateUserWallet.mockResolvedValue(mockWallet);
      mockWalletService.getBalance.mockResolvedValue('1.5');

      const { result } = renderHook(() => useUserWallet());

      await act(async () => {
        await result.current.initializeWallet();
      });

      expect(result.current.walletData).toEqual({
        address: '0x123',
        smartAccountAddress: '0x456',
        balance: '1.5',
      });
    });
  });

  describe('Loading States', () => {
    it('should show loading during initialization', async () => {
      const mockUser = { sub: 'user-123' };

      mockUseAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        getAccessTokenSilently: jest.fn(),
      } as any);

      // Make the service call hang
      mockUserWalletService.getOrCreateUserWallet.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useUserWallet());

      // Should be loading
      expect(result.current.isLoading).toBe(true);
    });

    it('should show loading during transaction', async () => {
      const mockUser = { sub: 'user-123' };
      const mockWallet = {
        address: '0x123',
        smartAccountAddress: '0x456',
      };

      mockUseAuth0.mockReturnValue({
        user: mockUser,
        isAuthenticated: true,
        getAccessTokenSilently: jest.fn(),
      } as any);

      mockUserWalletService.getOrCreateUserWallet.mockResolvedValue(mockWallet);
      mockWalletService.getBalance.mockResolvedValue('1.5');
      mockUserWalletService.getUserWallet.mockResolvedValue(mockWallet);

      // Make transaction hang
      mockWalletService.sendTransaction.mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      const { result } = renderHook(() => useUserWallet());

      // Wait for initialization
      await waitFor(() => {
        expect(result.current.walletData).not.toBeNull();
        expect(result.current.isLoading).toBe(false);
      });

      // Start transaction
      act(() => {
        result.current.sendTransaction({
          to: '0x789',
          value: '1.0',
        });
      });

      // Should be loading
      expect(result.current.isLoading).toBe(true);
    });
  });
});
