import { renderHook, act } from "@testing-library/react-hooks";
import { useAsyncInitialize } from "../useAsyncInitialize";

// Mock da função que será passada para o hook
const mockAsyncFunc = jest.fn();

describe("useAsyncInitialize", () => {
  beforeEach(() => {
    mockAsyncFunc.mockReset();
  });

  test("initializes with undefined and sets state after async function resolves", async () => {
    const mockValue = "async result";
    mockAsyncFunc.mockResolvedValue(mockValue);

    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncInitialize(mockAsyncFunc)
    );

    // Verifica o estado inicial (undefined)
    expect(result.current).toBeUndefined();

    // Espera a próxima atualização (quando o async function resolver)
    await waitForNextUpdate();

    // Verifica se o estado foi atualizado corretamente
    expect(result.current).toBe(mockValue);

    // Verifica se a função foi chamada
    expect(mockAsyncFunc).toHaveBeenCalledTimes(1);
  });

  test("re-invokes the function when dependencies change", async () => {
    const mockValue1 = "first result";
    const mockValue2 = "second result";

    mockAsyncFunc.mockResolvedValueOnce(mockValue1);

    const { result, rerender, waitForNextUpdate } = renderHook(
      ({ deps }) => useAsyncInitialize(mockAsyncFunc, deps),
      { initialProps: { deps: [1] } }
    );

    // Espera o async resolver na primeira renderização
    await waitForNextUpdate();

    // Verifica o valor atualizado
    expect(result.current).toBe(mockValue1);

    // Muda os deps e verifica se a função é chamada novamente
    mockAsyncFunc.mockResolvedValueOnce(mockValue2);
    rerender({ deps: [2] });

    // Espera a função async resolver novamente após a mudança de dependência
    await waitForNextUpdate();

    // Verifica o novo valor
    expect(result.current).toBe(mockValue2);

    // Verifica se a função foi chamada duas vezes
    expect(mockAsyncFunc).toHaveBeenCalledTimes(2);
  });
});
