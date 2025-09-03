import { renderHook, act } from '@testing-library/react';
import { useCounterContract } from '../../hooks/useCounterContract';
import { useTonClient } from '../../hooks/useTonClient';
import { useTonConnect } from '../../hooks/useTonConnect';
import { useAsyncInitialize } from '../../hooks/useAsyncInitialize';
import { useQuery } from '@tanstack/react-query';
import { CHAIN } from '@tonconnect/protocol';
import { Address, beginCell } from 'ton-core';

// Mock dependencies
jest.mock('../../hooks/useTonClient');
jest.mock('../../hooks/useTonConnect');
jest.mock('../../hooks/useAsyncInitialize');
jest.mock('@tanstack/react-query');

describe('useCounterContract', () => {
  const mockClient = {
    getContractState: jest.fn(),
    sendExternalMessage: jest.fn(),
  };

  const mockSender = {
    send: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useTonClient
    (useTonClient as jest.Mock).mockReturnValue({
      client: mockClient,
    });

    // Mock useTonConnect
    (useTonConnect as jest.Mock).mockReturnValue({
      sender: mockSender,
      network: CHAIN.MAINNET,
    });

    // Mock useAsyncInitialize
    (useAsyncInitialize as jest.Mock).mockReturnValue({
      address: Address.parse('EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH'),
      getCounter: jest.fn(),
      sendIncrement: jest.fn(),
    });

    // Mock useQuery
    (useQuery as jest.Mock).mockReturnValue({
      data: '10',
      isFetching: false,
    });
  });

  it('should initialize with mainnet address', async () => {
    const { result } = renderHook(() => useCounterContract());

    await act(async () => {
      await (useAsyncInitialize as jest.Mock).mock.calls[0][0]();
    });
    
    expect(result.current.address).toBe('EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH');
  });

  it('should initialize with testnet address when network is not mainnet', async () => {
    (useTonConnect as jest.Mock).mockReturnValue({
      sender: mockSender,
      network: CHAIN.TESTNET,
    });

    const mockContract = {
      address: Address.parse('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb'),
      getCounter: jest.fn(),
      sendIncrement: jest.fn(),
    };

    (useAsyncInitialize as jest.Mock).mockReturnValue(mockContract);

    const { result } = renderHook(() => useCounterContract());
    
    expect(result.current.address).toBe('EQBYLTm4nsvoqJRvs_L-IGNKwWs5RKe19HBK_lFadf19FUfb');
  });

  it('should return null value when client is not available', () => {
    (useTonClient as jest.Mock).mockReturnValue({
      client: null,
    });

    (useAsyncInitialize as jest.Mock).mockReturnValue(null);

    (useQuery as jest.Mock).mockReturnValue({
      data: null,
      isFetching: false,
    });

    const { result } = renderHook(() => useCounterContract());
    
    expect(result.current.value).toBeNull();
  });

  it('should return null value when fetching', () => {
    (useQuery as jest.Mock).mockReturnValue({
      data: '10',
      isFetching: true,
    });

    const { result } = renderHook(() => useCounterContract());
    
    expect(result.current.value).toBeNull();
  });

  it('should return counter value when available', async () => {
    const mockContract = {
      address: Address.parse('EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH'),
      getCounter: jest.fn().mockResolvedValue('10'),
      sendIncrement: jest.fn(),
    };

    (useAsyncInitialize as jest.Mock).mockReturnValue(mockContract);

    let queryFn: () => Promise<string | null>;
    (useQuery as jest.Mock).mockImplementation((options) => {
      queryFn = options.queryFn;
      return {
        data: '10',
        isFetching: false,
      };
    });

    const { result } = renderHook(() => useCounterContract());

    await act(async () => {
      const value = await queryFn();
      expect(value).toBe('10');
    });
    
    expect(result.current.value).toBe('10');
    expect(mockContract.getCounter).toHaveBeenCalled();
  });

  it('should handle active contract state', async () => {
    const mockContract = {
      address: Address.parse('EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH'),
      getCounter: jest.fn().mockImplementation(async () => {
        const state = await mockClient.getContractState(mockContract.address);
        return state.state === 'active' ? state.balance.toString() || '0' : '0';
      }),
      sendIncrement: jest.fn(),
    };

    mockClient.getContractState.mockResolvedValue({
      state: 'active',
      balance: '10',
    });

    (useAsyncInitialize as jest.Mock).mockReturnValue(mockContract);

    let queryFn: () => Promise<string | null>;
    (useQuery as jest.Mock).mockImplementation((options) => {
      queryFn = options.queryFn;
      return {
        data: '10',
        isFetching: false,
      };
    });

    const { result } = renderHook(() => useCounterContract());

    await act(async () => {
      const value = await queryFn();
      expect(value).toBe('10');
    });

    expect(mockClient.getContractState).toHaveBeenCalledWith(mockContract.address);
  });

  it('should handle inactive contract state', async () => {
    const mockContract = {
      address: Address.parse('EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH'),
      getCounter: jest.fn().mockImplementation(async () => {
        const state = await mockClient.getContractState(mockContract.address);
        return state.state === 'active' ? state.balance.toString() || '0' : '0';
      }),
      sendIncrement: jest.fn(),
    };

    mockClient.getContractState.mockResolvedValue({
      state: 'inactive',
      balance: '10',
    });

    (useAsyncInitialize as jest.Mock).mockReturnValue(mockContract);

    const { result } = renderHook(() => useCounterContract());

    await act(async () => {
      const value = await mockContract.getCounter();
      expect(value).toBe('0');
    });

    expect(mockClient.getContractState).toHaveBeenCalledWith(mockContract.address);
  });

  it('should handle active contract state with no balance', async () => {
    const mockContract = {
      address: Address.parse('EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH'),
      getCounter: jest.fn().mockImplementation(async () => {
        const state = await mockClient.getContractState(mockContract.address);
        return state.state === 'active' ? state.balance.toString() || '0' : '0';
      }),
      sendIncrement: jest.fn(),
    };

    mockClient.getContractState.mockResolvedValue({
      state: 'active',
      balance: '',
    });

    (useAsyncInitialize as jest.Mock).mockReturnValue(mockContract);

    const { result } = renderHook(() => useCounterContract());

    await act(async () => {
      const value = await mockContract.getCounter();
      expect(value).toBe('0');
    });

    expect(mockClient.getContractState).toHaveBeenCalledWith(mockContract.address);
  });

  it('should send increment message', async () => {
    const mockContract = {
      address: Address.parse('EQBPEDbGdwaLv1DKntg9r6SjFIVplSaSJoJ-TVLe_2rqBOmH'),
      getCounter: jest.fn(),
      sendIncrement: jest.fn(),
    };

    (useAsyncInitialize as jest.Mock).mockReturnValue(mockContract);

    const { result } = renderHook(() => useCounterContract());
    
    await act(async () => {
      await result.current.sendIncrement();
    });

    expect(mockContract.sendIncrement).toHaveBeenCalledWith(mockSender);
  });

  it('should not send increment when contract is not initialized', async () => {
    (useAsyncInitialize as jest.Mock).mockReturnValue(null);

    const { result } = renderHook(() => useCounterContract());
    
    await act(async () => {
      await result.current.sendIncrement();
    });

    expect(mockClient.sendExternalMessage).not.toHaveBeenCalled();
  });
});
