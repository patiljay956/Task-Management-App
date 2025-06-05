import { cn } from "@/lib/utils";
import AppSidebar from "./app-sidebar";
import AppNav from "./app-nav";

type Props = {
    children?: React.ReactNode;
    className?: string;
};

export default function AppLayout({ children, className }: Props) {
    return (
        <div className={cn("flex min-h-svh w-full", className)}>
            <AppSidebar />
            <div className="flex flex-col flex-1">
                <AppNav />
                <main className="flex flex-1">{children}</main>
            </div>
        </div>
    );
}
