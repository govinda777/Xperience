import { renderHook, act } from '@testing-library/react';
import { useTonConnect } from '../../hooks/useTonConnect';
import { useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { CHAIN } from '@tonconnect/protocol';
import { Address } from 'ton-core';
// Mock dependencies
jest.mock('@tonconnect/ui-react');
describe('useTonConnect', () => {
    const mockAddress = 'EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t';
    const mockSendTransaction = jest.fn();
    const mockTonConnectUI = {
        sendTransaction: mockSendTransaction,
    };
    beforeEach(() => {
        jest.clearAllMocks();
        useTonConnectUI.mockReturnValue([mockTonConnectUI]);
    });
    it('should return disconnected state when wallet is not connected', () => {
        useTonWallet.mockReturnValue(null);
        const { result } = renderHook(() => useTonConnect());
        expect(result.current.connected).toBe(false);
        expect(result.current.wallet).toBeNull();
        expect(result.current.network).toBeNull();
    });
    it('should return connected state with mainnet wallet', () => {
        useTonWallet.mockReturnValue({
            account: {
                address: mockAddress,
                chain: CHAIN.MAINNET,
            },
        });
        const { result } = renderHook(() => useTonConnect());
        expect(result.current.connected).toBe(true);
        expect(result.current.wallet).toBe(mockAddress);
        expect(result.current.network).toBe(CHAIN.MAINNET);
    });
    it('should return connected state with testnet wallet', () => {
        useTonWallet.mockReturnValue({
            account: {
                address: mockAddress,
                chain: CHAIN.TESTNET,
            },
        });
        const { result } = renderHook(() => useTonConnect());
        expect(result.current.connected).toBe(true);
        expect(result.current.wallet).toBe(mockAddress);
        expect(result.current.network).toBe(CHAIN.TESTNET);
    });
    it('should send transaction with correct parameters', async () => {
        useTonWallet.mockReturnValue({
            account: {
                address: mockAddress,
                chain: CHAIN.MAINNET,
            },
        });
        const { result } = renderHook(() => useTonConnect());
        const mockToAddress = Address.parse('EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t');
        const mockValue = 1000000000n; // 1 TON
        const mockBody = {
            toBoc: () => Buffer.from('test'),
            type: 'Cell',
            bits: new Uint8Array(),
            refs: [],
            mask: 0,
            hash: () => Buffer.from('test'),
            depth: () => 0,
            level: () => 0,
            isExotic: false,
            beginParse: () => ({ type: 'Slice' }),
            clone: () => mockBody,
        };
        await act(async () => {
            await result.current.sender.send({
                to: mockToAddress,
                value: mockValue,
                body: mockBody,
            });
        });
        expect(mockSendTransaction).toHaveBeenCalledWith({
            messages: [
                {
                    address: mockToAddress.toString(),
                    amount: mockValue.toString(),
                    payload: mockBody.toBoc().toString('base64'),
                },
            ],
            validUntil: expect.any(Number),
        });
        // Verify validUntil is roughly 5 minutes in the future
        const validUntil = mockSendTransaction.mock.calls[0][0].validUntil;
        const now = Date.now();
        expect(validUntil).toBeGreaterThan(now + 4.9 * 60 * 1000); // Allow for small timing differences
        expect(validUntil).toBeLessThan(now + 5.1 * 60 * 1000);
    });
    it('should send transaction without body', async () => {
        useTonWallet.mockReturnValue({
            account: {
                address: mockAddress,
                chain: CHAIN.MAINNET,
            },
        });
        const { result } = renderHook(() => useTonConnect());
        const mockToAddress = Address.parse('EQD4FPq-PRDieyQKkizFTRtSDyucUIqrj0v_zXJmqaDp6_0t');
        const mockValue = 1000000000n; // 1 TON
        await act(async () => {
            await result.current.sender.send({
                to: mockToAddress,
                value: mockValue,
            });
        });
        expect(mockSendTransaction).toHaveBeenCalledWith({
            messages: [
                {
                    address: mockToAddress.toString(),
                    amount: mockValue.toString(),
                    payload: undefined,
                },
            ],
            validUntil: expect.any(Number),
        });
    });
});
