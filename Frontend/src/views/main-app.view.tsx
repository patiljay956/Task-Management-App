import AppLayout from "@/components/layout/app-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Navigate, Route, Routes } from "react-router";
import UserProjects from "./app/user-projects.view";
import ProjectView from "./app/project.view";
import { ErrorBoundary } from "@/components/error/error-boundary";
import { TaskView } from "./app/task.view";
import UserTasksView from "./app/user-tasks.view";
import UserNotesView from "./app/notes.view";
import NotFound from "./not-found.view";
import DashboardView from "./app/dashboard.view";

type Props = {};

export default function MainApp({}: Props) {
    return (
        <SidebarProvider>
            <AppLayout>
                <ErrorBoundary>
                    <Routes>
                        <Route
                            path="/"
                            element={
                                <Navigate to="dashboard" replace></Navigate>
                            }
                        />
                        <Route
                            path={"/dashboard"}
                            element={<DashboardView />}
                        />
                        <Route path={"projects"} element={<UserProjects />} />
                        <Route
                            path={"project/:projectId/kanban"}
                            element={<ProjectView tab="kanban" />}
                        />
                        <Route
                            path={"project/:projectId/tasklist"}
                            element={<ProjectView tab="tasklist" />}
                        />
                        <Route
                            path={"project/:projectId/members"}
                            element={<ProjectView tab="members" />}
                        />
                        <Route
                            path={"project/:projectId/notes"}
                            element={<ProjectView tab="notes" />}
                        />
                        <Route
                            path="project/:projectId/task/:taskId"
                            element={<TaskView />}
                        />
                        <Route path="tasks" element={<UserTasksView />} />
                        <Route path="notes" element={<UserNotesView />} />
                        <Route
                            path="*"
                            element={<NotFound className="h-full" />}
                        />
                    </Routes>
                </ErrorBoundary>
            </AppLayout>
        </SidebarProvider>
    );
}
