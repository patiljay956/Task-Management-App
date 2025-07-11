import AppSidebar from "./app-sidebar";
import AppNav from "./app-nav";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

type Props = {
    children?: React.ReactNode;
};

export default function AppLayout({ children }: Props) {
    return (
        <div className="flex h-svh w-full overflow-hidden">
            <AppSidebar />

            <div className="flex flex-col flex-1 min-h-0 min-w-0">
                <AppNav className="sticky top-0 z-50 bg-background border-b" />

                <ScrollArea className="flex flex-1 overflow-auto p-5">
                    <div className="flex flex-col flex-1 min-h-0">
                        {children}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </div>
    );
}
