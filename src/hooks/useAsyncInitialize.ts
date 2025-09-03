import { useEffect, useState } from "react";

export function useAsyncInitialize<T>(
  func: () => Promise<T>,
  deps: unknown[] = [],
) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    (async () => {
      try {
        setState(await func());
      } catch (error) {
        console.error('Error in useAsyncInitialize:', error);
        setState(undefined);
      }
    })();
  }, deps);

  return state;
}
