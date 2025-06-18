import AppLayout from "@/components/layout/app-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Route, Routes } from "react-router";
import UserProjects from "./app/user-projects.view";
import ProjectView from "./app/project.view";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { TaskView } from "./app/task.view";
import UserTasksView from "./app/user-tasks.view";

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
                        <Route
                            path="project/:projectId/task/:taskId"
                            element={<TaskView />}
                        />
                        <Route path="tasks" element={<UserTasksView />} />
                    </Routes>
                </ErrorBoundary>
            </AppLayout>
        </SidebarProvider>
    );
}
