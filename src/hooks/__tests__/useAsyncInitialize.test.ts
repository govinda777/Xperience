// src/hooks/__tests__/useAsyncInitialize.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAsyncInitialize } from '../useAsyncInitialize';

describe('useAsyncInitialize', () => {
  it('should initialize with async function', async () => {
    const mockValue = 'test value';
    const mockAsyncFunc = jest.fn();
    mockAsyncFunc.mockResolvedValue(mockValue);

    const { result } = renderHook(() => useAsyncInitialize(mockAsyncFunc));

    expect(result.current).toBe(undefined);
    expect(mockAsyncFunc).toHaveBeenCalled();

    // Aguarda a resolução da Promise
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe(mockValue);
  });

  it('should reinitialize when deps change', async () => {
    const mockValue1 = 'test value 1';
    const mockValue2 = 'test value 2';
    const mockAsyncFunc = jest.fn();

    mockAsyncFunc.mockResolvedValueOnce(mockValue1);
    mockAsyncFunc.mockResolvedValueOnce(mockValue2);

    const { result, rerender } = renderHook(
      ({ deps }) => useAsyncInitialize(mockAsyncFunc, deps),
      { initialProps: { deps: [1] } }
    );

    // Aguarda primeira inicialização
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe(mockValue1);

    // Muda as dependências e aguarda nova inicialização
    await act(async () => {
      rerender({ deps: [2] });
      await Promise.resolve();
    });

    expect(result.current).toBe(mockValue2);
    expect(mockAsyncFunc).toHaveBeenCalledTimes(2);
  });
});