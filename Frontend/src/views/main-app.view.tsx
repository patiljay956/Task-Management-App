import AppLayout from "@/components/layout/app-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Route, Routes } from "react-router";
import UserProjects from "./app/user-projects.view";

type Props = {};

export default function MainApp({}: Props) {
    return (
        <SidebarProvider>
            <AppLayout>
                <Routes>
                    <Route path="/projects" element={<UserProjects />} />
                </Routes>
            </AppLayout>
        </SidebarProvider>
    );
}
