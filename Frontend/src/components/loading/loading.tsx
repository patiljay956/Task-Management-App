import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

type Props = {
    message?: string;
    className?: string;
    fullScreen?: boolean;
};

export default function Loading({
    className,
    message = "Loading, please wait...",
    fullScreen = true,
}: Props) {
    return (
        <div
            className={cn(
                "w-full flex flex-1 items-center justify-center bg-gray-10",
                fullScreen && "min-h-svh",
                className,
            )}
        >
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-10 w-10 animate-spin" />
                <p className="text-gray-700 dark:text-gray-300 text-sm">
                    {message}
                </p>
            </div>
        </div>
    );
}
