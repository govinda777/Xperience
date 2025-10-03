import { renderHook, act } from '@testing-library/react';
import { useTonClient } from '../../hooks/useTonClient';
import { useTonConnect } from '../../hooks/useTonConnect';
import { useAsyncInitialize } from '../../hooks/useAsyncInitialize';
import { CHAIN } from '@tonconnect/protocol';
import { TonClient } from 'ton';
import { getHttpEndpoint } from '@orbs-network/ton-access';
// Mock dependencies
jest.mock('../../hooks/useTonConnect');
jest.mock('../../hooks/useAsyncInitialize');
jest.mock('@orbs-network/ton-access');
jest.mock('ton');
describe('useTonClient', () => {
    const mockEndpoint = 'https://mock-endpoint.com';
    const mockClient = { endpoint: mockEndpoint };
    beforeEach(() => {
        jest.clearAllMocks();
        jest.useFakeTimers();
        getHttpEndpoint.mockResolvedValue(mockEndpoint);
        TonClient.mockImplementation((config) => ({
            ...mockClient,
            ...config,
        }));
    });
    afterEach(() => {
        jest.useRealTimers();
    });
    it('should return undefined client when network is not available', async () => {
        useTonConnect.mockReturnValue({
            network: undefined,
        });
        useAsyncInitialize.mockImplementation((fn) => {
            fn(); // Call the function but don't wait for it
            return undefined;
        });
        const { result } = renderHook(() => useTonClient());
        expect(result.current.client).toBeUndefined();
        expect(getHttpEndpoint).not.toHaveBeenCalled();
        expect(TonClient).not.toHaveBeenCalled();
    });
    it('should initialize client with mainnet endpoint', async () => {
        useTonConnect.mockReturnValue({
            network: CHAIN.MAINNET,
        });
        const mockMainnetClient = { endpoint: mockEndpoint };
        useAsyncInitialize.mockImplementation(async (fn) => {
            const client = await fn();
            return client;
        });
        const { result } = renderHook(() => useTonClient());
        await act(async () => {
            await Promise.resolve();
            jest.advanceTimersByTime(5000);
        });
        expect(result.current.client).toBeDefined();
        expect(getHttpEndpoint).toHaveBeenCalledWith({
            network: 'mainnet',
        });
    });
    it('should initialize client with testnet endpoint', async () => {
        useTonConnect.mockReturnValue({
            network: CHAIN.TESTNET,
        });
        const mockTestnetClient = { endpoint: mockEndpoint };
        useAsyncInitialize.mockImplementation(async (fn) => {
            const client = await fn();
            return client;
        });
        const { result } = renderHook(() => useTonClient());
        await act(async () => {
            await Promise.resolve();
            jest.advanceTimersByTime(5000);
        });
        expect(result.current.client).toBeDefined();
        expect(getHttpEndpoint).toHaveBeenCalledWith({
            network: 'testnet',
        });
    });
    it('should handle endpoint fetch error', async () => {
        useTonConnect.mockReturnValue({
            network: CHAIN.MAINNET,
        });
        const error = new Error('Failed to fetch endpoint');
        getHttpEndpoint.mockRejectedValue(error);
        // Mock useAsyncInitialize to actually execute the function and handle errors
        useAsyncInitialize.mockImplementation((fn) => {
            fn().catch(() => undefined); // Execute the function but ignore errors
            return undefined; // Return undefined immediately
        });
        const { result } = renderHook(() => useTonClient());
        expect(result.current.client).toBeUndefined();
    });
});
