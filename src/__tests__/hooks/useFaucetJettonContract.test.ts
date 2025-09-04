import { renderHook, act } from '@testing-library/react';
import { useFaucetJettonContract } from '../../hooks/useFaucetJettonContract';
import { useTonClient } from '../../hooks/useTonClient';
import { useTonConnect } from '../../hooks/useTonConnect';
import { useAsyncInitialize } from '../../hooks/useAsyncInitialize';
import { useQuery } from '@tanstack/react-query';
import { Address, beginCell } from 'ton-core';

// Mock dependencies
jest.mock('../../hooks/useTonClient');
jest.mock('../../hooks/useTonConnect');
jest.mock('../../hooks/useAsyncInitialize');
jest.mock('@tanstack/react-query');

describe('useFaucetJettonContract', () => {
  const mockClient = {
    getContractState: jest.fn(),
    sendExternalMessage: jest.fn(),
  };

  const mockSender = {
    send: jest.fn(),
  };

  const mockWalletAddress = 'EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH';

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useTonClient
    (useTonClient as jest.Mock).mockReturnValue({
      client: mockClient,
    });

    // Mock useTonConnect
    (useTonConnect as jest.Mock).mockReturnValue({
      wallet: mockWalletAddress,
      sender: mockSender,
    });

    // Mock useQuery
    (useQuery as jest.Mock).mockReturnValue({
      data: '10',
      isFetching: false,
    });
  });

  it('should initialize faucet jetton contract', async () => {
    mockClient.getContractState.mockResolvedValue({
      state: 'active',
      balance: '10',
    });

    const { result } = renderHook(() => useFaucetJettonContract());

    await act(async () => {
      const fn = (useAsyncInitialize as jest.Mock).mock.calls[0][0];
      const contract = await fn();
      const walletAddress = await contract.getWalletAddress(Address.parse(mockWalletAddress));
      expect(walletAddress).toBe('10');
    });
    
    expect(useAsyncInitialize).toHaveBeenCalledWith(
      expect.any(Function),
      [mockClient, mockWalletAddress]
    );
  });

  it('should handle inactive faucet contract state', async () => {
    mockClient.getContractState.mockResolvedValue({
      state: 'inactive',
      balance: '10',
    });

    const { result } = renderHook(() => useFaucetJettonContract());

    await act(async () => {
      const fn = (useAsyncInitialize as jest.Mock).mock.calls[0][0];
      const contract = await fn();
      const walletAddress = await contract.getWalletAddress(Address.parse(mockWalletAddress));
      expect(walletAddress).toBe('');
    });
  });

  it('should initialize jetton wallet contract', async () => {
    const mockFaucetContract = {
      address: Address.parse('EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y'),
      getWalletAddress: jest.fn().mockResolvedValue('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb'),
      sendMintFromFaucet: jest.fn(),
    };

    mockClient.getContractState.mockResolvedValue({
      state: 'active',
      balance: '10',
    });

    (useAsyncInitialize as jest.Mock)
      .mockReturnValueOnce(mockFaucetContract);

    const { result } = renderHook(() => useFaucetJettonContract());

    await act(async () => {
      const fn = (useAsyncInitialize as jest.Mock).mock.calls[1][0];
      const contract = await fn();
      expect(contract.address.toFriendly()).toBe('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb');
      const balance = await contract.getBalance();
      expect(balance).toBe('10');
    });
  });

  it('should handle inactive jetton wallet contract state', async () => {
    const mockFaucetContract = {
      address: Address.parse('EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y'),
      getWalletAddress: jest.fn().mockResolvedValue('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb'),
      sendMintFromFaucet: jest.fn(),
    };

    mockClient.getContractState.mockResolvedValue({
      state: 'inactive',
      balance: '10',
    });

    (useAsyncInitialize as jest.Mock)
      .mockReturnValueOnce(mockFaucetContract);

    const { result } = renderHook(() => useFaucetJettonContract());

    await act(async () => {
      const fn = (useAsyncInitialize as jest.Mock).mock.calls[1][0];
      const contract = await fn();
      expect(contract.address.toFriendly()).toBe('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb');
      const balance = await contract.getBalance();
      expect(balance).toBe('0');
    });
  });

  it('should handle empty balance in jetton wallet contract', async () => {
    const mockFaucetContract = {
      address: Address.parse('EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y'),
      getWalletAddress: jest.fn().mockResolvedValue('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb'),
      sendMintFromFaucet: jest.fn(),
    };

    mockClient.getContractState.mockResolvedValue({
      state: 'active',
      balance: '',
    });

    (useAsyncInitialize as jest.Mock)
      .mockReturnValueOnce(mockFaucetContract);

    const { result } = renderHook(() => useFaucetJettonContract());

    await act(async () => {
      const fn = (useAsyncInitialize as jest.Mock).mock.calls[1][0];
      const contract = await fn();
      expect(contract.address.toFriendly()).toBe('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb');
      const balance = await contract.getBalance();
      expect(balance).toBe('0');
    });
  });

  it('should not initialize jetton wallet contract when faucet contract is not available', () => {
    (useAsyncInitialize as jest.Mock)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);

    const { result } = renderHook(() => useFaucetJettonContract());
    
    expect(result.current.jettonWalletAddress).toBeUndefined();
  });

  it('should not initialize jetton wallet contract when client is not available', () => {
    (useTonClient as jest.Mock).mockReturnValue({
      client: null,
    });

    (useAsyncInitialize as jest.Mock)
      .mockReturnValueOnce(null)
      .mockReturnValueOnce(null);

    const { result } = renderHook(() => useFaucetJettonContract());
    
    expect(result.current.jettonWalletAddress).toBeUndefined();
  });

  it('should return null balance when fetching', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: '10',
      isFetching: true,
    });

    const { result } = renderHook(() => useFaucetJettonContract());
    
    expect(result.current.balance).toBeNull();
  });

  it('should return balance when available', () => {
    const { result } = renderHook(() => useFaucetJettonContract());
    
    expect(result.current.balance).toBe('10');
  });

  it('should mint tokens', async () => {
    const mockFaucetContract = {
      address: Address.parse('EQB8StgTQXidy32a8xfu7j4HMoWYV0b0cFM8nXsP2cza_b7Y'),
      getWalletAddress: jest.fn(),
      sendMintFromFaucet: jest.fn(),
    };

    (useAsyncInitialize as jest.Mock).mockReturnValueOnce(mockFaucetContract);

    const { result } = renderHook(() => useFaucetJettonContract());
    
    await act(async () => {
      result.current.mint();
    });

    expect(mockFaucetContract.sendMintFromFaucet).toHaveBeenCalledWith(
      mockSender,
      expect.objectContaining({
        toBuffer: expect.any(Function),
        toFriendly: expect.any(Function),
        toFriendlyBuffer: expect.any(Function),
        toString: expect.any(Function),
        workChain: 0,
      })
    );
  });

  it('should not mint tokens when contract is not initialized', async () => {
    (useAsyncInitialize as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useFaucetJettonContract());
    
    await act(async () => {
      result.current.mint();
    });

    expect(mockClient.sendExternalMessage).not.toHaveBeenCalled();
  });
});
