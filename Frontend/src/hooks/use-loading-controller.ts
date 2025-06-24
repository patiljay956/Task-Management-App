// hooks/use-loading-controller.ts
import { useCallback, useState } from "react";

export function useLoadingController(initial = false) {
    const [loading, setLoading] = useState<boolean>(initial);
    const [message, setMessage] = useState<string>("Loading...");

    const start = useCallback((msg?: string) => {
        setLoading(true);
        if (msg) setMessage(msg);
    }, []);

    const stop = useCallback(() => {
        setLoading(false);
    }, []);

    const withLoading = useCallback(
        async <T>(fn: () => Promise<T>, msg?: string): Promise<T> => {
            start(msg);
            try {
                const result = await fn();
                return result;
            } finally {
                stop();
            }
        },
        [start, stop],
    );

    return {
        loading,
        message,
        start,
        stop,
        withLoading,
    };
}
