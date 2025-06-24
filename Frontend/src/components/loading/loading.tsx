// components/ui/loading.tsx
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type SkeletonVariant = "text" | "list" | "card" | "table";

type LoadingProps = {
    message?: string;
    className?: string;
    fullScreen?: boolean;
    size?: number;
    icon?: React.ReactNode;
    skeleton?: boolean;
    skeletonCount?: number; // number of rows/cards/items
    skeletonType?: SkeletonVariant;
};

export default function Loading({
    message = "Loading, please wait...",
    className,
    fullScreen = true,
    size = 40,
    icon,
    skeleton = false,
    skeletonCount = 3,
    skeletonType = "text",
}: LoadingProps) {
    if (skeleton) {
        if (skeletonType === "list") {
            return (
                <div className={cn("flex flex-col gap-4", className)}>
                    {Array.from({ length: skeletonCount }).map((_, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-full" />
                            <div className="flex flex-col gap-2 w-full">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-3 w-1/2" />
                            </div>
                        </div>
                    ))}
                </div>
            );
        }

        if (skeletonType === "card") {
            return (
                <div
                    className={cn(
                        "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4",
                        className,
                    )}
                >
                    {Array.from({ length: skeletonCount }).map((_, i) => (
                        <div
                            key={i}
                            className="p-4 border rounded-xl space-y-3"
                        >
                            <Skeleton className="h-40 w-full rounded-md" />
                            <Skeleton className="h-4 w-3/4" />
                            <Skeleton className="h-4 w-1/2" />
                        </div>
                    ))}
                </div>
            );
        }

        if (skeletonType === "table") {
            return (
                <div className={cn("w-full overflow-hidden", className)}>
                    <div className="grid grid-cols-5 gap-4 p-4 border-b bg-muted text-sm font-medium text-muted-foreground">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-28" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                    {Array.from({ length: skeletonCount }).map((_, i) => (
                        <div
                            key={i}
                            className="grid grid-cols-5 gap-4 p-4 border-b text-sm"
                        >
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-4 w-32" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-4 w-28" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    ))}
                </div>
            );
        }

        // Default: text
        return (
            <div className={cn("flex flex-col gap-3", className)}>
                {Array.from({ length: skeletonCount }).map((_, i) => (
                    <Skeleton key={i} className="h-4 w-full rounded" />
                ))}
            </div>
        );
    }

    return (
        <div
            role="status"
            aria-live="polite"
            className={cn(
                "w-full flex items-center justify-center",
                fullScreen ? "min-h-svh" : "py-6",
                className,
            )}
        >
            <div className="flex flex-col items-center gap-3">
                {icon ?? (
                    <Loader2
                        className="animate-spin"
                        style={{ width: size, height: size }}
                    />
                )}
                <p className="text-muted-foreground text-sm">{message}</p>
            </div>
        </div>
    );
}
