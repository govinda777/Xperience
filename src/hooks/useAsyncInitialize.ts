import { useEffect, useState } from "react";

export function useAsyncInitialize<T>(
  func: () => Promise<T>,
  deps: unknown[] = [],
) {
  const [state, setState] = useState<T | undefined>();
  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const result = await func();
        if (isMounted) {
          setState(result);
        }
      } catch (error) {
        if (isMounted) {
          console.error('Error in useAsyncInitialize:', error);
          setState(undefined);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, deps);

  return state;
}
