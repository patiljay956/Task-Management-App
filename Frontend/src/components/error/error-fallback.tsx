// src/components/ErrorFallback.tsx
import { type FallbackProps } from "react-error-boundary";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export const ErrorFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
    return (
        <div className="flex min-h-screen items-center justify-center px-4 py-12 bg-background">
            <Alert variant="destructive" className="w-full max-w-md shadow-lg">
                <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-destructive" />
                    <div>
                        <AlertTitle className="text-lg font-semibold">
                            Something went wrong
                        </AlertTitle>
                        <AlertDescription className="mt-1 text-sm text-muted-foreground">
                            {error?.message || "An unexpected error occurred."}
                        </AlertDescription>

                        <div className="mt-4 flex gap-2">
                            <Button
                                variant="destructive"
                                onClick={resetErrorBoundary}
                            >
                                Retry
                            </Button>
                            <Button
                                variant="outline"
                                onClick={() => (window.location.href = "/")}
                            >
                                Go Home
                            </Button>
                        </div>
                    </div>
                </div>
            </Alert>
        </div>
    );
};
