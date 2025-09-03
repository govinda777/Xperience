import { renderHook, act } from '@testing-library/react';
import { useAsyncInitialize } from '../../hooks/useAsyncInitialize';

describe('useAsyncInitialize', () => {
  it('should initialize with undefined', () => {
    const asyncFunc = jest.fn().mockResolvedValue('test-value');
    const { result } = renderHook(() => useAsyncInitialize(asyncFunc));
    expect(result.current).toBeUndefined();
  });

  it('should set state after async function resolves', async () => {
    const asyncFunc = jest.fn().mockResolvedValue('test-value');
    const { result } = renderHook(() => useAsyncInitialize(asyncFunc));
    
    // Wait for async function to resolve
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe('test-value');
    expect(asyncFunc).toHaveBeenCalledTimes(1);
  });

  it('should re-run when dependencies change', async () => {
    const asyncFunc = jest.fn().mockResolvedValue('test-value');
    const { result, rerender } = renderHook(
      ({ dep }) => useAsyncInitialize(asyncFunc, [dep]),
      { initialProps: { dep: 1 } }
    );

    // Wait for first render
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe('test-value');
    expect(asyncFunc).toHaveBeenCalledTimes(1);

    // Change dependency and rerender
    rerender({ dep: 2 });

    // Wait for second render
    await act(async () => {
      await Promise.resolve();
    });

    expect(asyncFunc).toHaveBeenCalledTimes(2);
  });

  it('should handle async function rejection', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    const asyncFunc = jest.fn().mockRejectedValue(new Error('test error'));
    
    const { result } = renderHook(() => useAsyncInitialize(asyncFunc));
    
    // Wait for async function to reject
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBeUndefined();
    
    consoleErrorSpy.mockRestore();
  });

  it('should use empty dependency array by default', async () => {
    const asyncFunc = jest.fn().mockResolvedValue('test-value');
    const { result, rerender } = renderHook(() => useAsyncInitialize(asyncFunc));

    // Wait for first render
    await act(async () => {
      await Promise.resolve();
    });

    expect(result.current).toBe('test-value');
    expect(asyncFunc).toHaveBeenCalledTimes(1);

    // Rerender should not trigger another call
    rerender();
    expect(asyncFunc).toHaveBeenCalledTimes(1);
  });
});
