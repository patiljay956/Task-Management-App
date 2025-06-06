import AppLayout from "@/components/layout/app-layout";
import { SidebarProvider } from "@/components/ui/sidebar";

type Props = {};

export default function MainApp({}: Props) {
    return (
        <SidebarProvider>
            <AppLayout></AppLayout>
        </SidebarProvider>
    );
}
