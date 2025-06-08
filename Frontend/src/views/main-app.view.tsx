import AppLayout from "@/components/layout/app-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Route, Routes } from "react-router";
import UserProjects from "./app/user-projects.view";
import ProjectView from "./app/project.view";
import { ErrorBoundary } from "@/components/error/error-boundary";

type Props = {};

export default function MainApp({}: Props) {
    return (
        <SidebarProvider>
            <AppLayout>
                <ErrorBoundary>
                    <Routes>
                        <Route path={"projects"} element={<UserProjects />} />
                        <Route
                            path={"project/:projectId"}
                            element={<ProjectView />}
                        />
                    </Routes>
                </ErrorBoundary>
            </AppLayout>
        </SidebarProvider>
    );
}
