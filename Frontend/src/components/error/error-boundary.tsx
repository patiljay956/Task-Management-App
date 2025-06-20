// src/components/ErrorBoundary.tsx
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "@/components/error/error-fallback";

interface Props {
    children: React.ReactNode;
}

export const ErrorBoundary = ({ children }: Props) => {
    return (
        <ReactErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
                window.location.reload(); // or custom logic
            }}
        >
            {children}
        </ReactErrorBoundary>
    );
};
