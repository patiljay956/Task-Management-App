import { cn } from "@/lib/utils";
import { SidebarTrigger } from "../ui/sidebar";

type Props = {
    className?: string;
};

export default function AppNav({ className }: Props) {
    return (
        <div
            className={cn("flex items-center gap-2 h-14 border-b-1", className)}
        >
            <SidebarTrigger className="h-10 w-10"></SidebarTrigger>
        </div>
    );
}
