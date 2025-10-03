import { useEffect, useState } from "react";
export function useAsyncInitialize(func, deps = []) {
    const [state, setState] = useState();
    useEffect(() => {
        (async () => {
            try {
                setState(await func());
            }
            catch (error) {
                console.error('Error in useAsyncInitialize:', error);
                setState(undefined);
            }
        })();
    }, deps);
    return state;
}
