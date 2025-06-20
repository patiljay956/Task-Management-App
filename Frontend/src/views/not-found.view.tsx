import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Ban, ArrowLeft, Home } from "lucide-react";
import { useNavigate } from "react-router";

type Props = {
    className?: string;
};

export default function NotFound({ className }: Props) {
    const navigate = useNavigate();

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center px-4 text-center bg-background",
                className,
            )}
        >
            <div className="bg-muted rounded-2xl p-6 md:p-10 shadow-md max-w-md w-full">
                <div className="flex justify-center mb-6">
                    <Ban className="w-16 h-16 text-destructive" />
                </div>
                <h1 className="text-3xl font-bold mb-2">
                    404 - Page Not Found
                </h1>
                <p className="text-muted-foreground mb-6">
                    Sorry, the page you are looking for doesn't exist or has
                    been moved.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                    <Button onClick={() => navigate("/")} className="gap-2">
                        <Home size={18} />
                        Go Home
                    </Button>
                    <Button
                        variant="secondary"
                        onClick={() => navigate(-1)}
                        className="gap-2"
                    >
                        <ArrowLeft size={18} />
                        Go Back
                    </Button>
                </div>
            </div>
        </div>
    );
}
