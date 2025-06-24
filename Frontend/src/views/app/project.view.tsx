import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectMembersTab from "../tabs/project-members-tab";
import { useNavigate, useParams } from "react-router";
import ProjectTasklistTab from "../tabs/project-tasklist-tab";
import ProjectKanbanTab from "../tabs/project-kanban-tab";
import { useStore } from "@/components/contexts/store-provider";
import { useEffect, useState } from "react";
import type { AxiosResponse } from "axios";
import type {
    Note,
    Project,
    ProjectMember,
    ProjectTasks,
    Task,
} from "@/types/project";
import { API_NOTE_ENDPOINTS, API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import axios from "axios";
import { toast } from "sonner";
import ProjectNotesTab from "../tabs/project-notes-tab";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { useLoadingController } from "@/hooks/use-loading-controller";
import Loading from "@/components/loading/loading";

type Props = {
    tab: "members" | "tasklist" | "kanban" | "notes";
};

// Helper function to calculate completion rate
const calculateCompletionRate = (tasks?: ProjectTasks): number => {
    if (!tasks) return 0;

    const totalTasks =
        tasks.todo.length + tasks.in_progress.length + tasks.done.length;
    if (totalTasks === 0) return 0;

    const completedTasks = tasks.done.length;
    return Math.round((completedTasks / totalTasks) * 100);
};

export default function ProjectView({ tab = "kanban" }: Props) {
    const { projectId } = useParams<{ projectId: string }>();
    const { setStore, store } = useStore();
    const navigate = useNavigate();
    const [activeProject, setActiveProject] = useState<Project | null>(null);
    const { loading, stop, withLoading } = useLoadingController(true);

    const handleTabChange = (value: string) => {
        navigate(`/app/project/${projectId}/${value}`);
    };
    useEffect(() => {
        const getProject = async () => {
            if (!projectId) return;

            try {
                const response: AxiosResponse | undefined =
                    await API_PROJECT_ENDPOINTS.getProjectById(projectId);

                if (response.data.statusCode === 200) {
                    const project = response.data.data[0] as Project;
                    setActiveProject(project);

                    setStore((prev) => {
                        const existingProjectIndex = prev.projects.findIndex(
                            (p) => p._id === projectId,
                        );

                        if (existingProjectIndex !== -1) {
                            // Update existing project
                            const updatedProjects = [...prev.projects];
                            updatedProjects[existingProjectIndex] = project;
                            return {
                                ...prev,
                                projects: updatedProjects,
                            };
                        } else {
                            // Add new project if it doesn't exist
                            return {
                                ...prev,
                                projects: [...prev.projects, project],
                            };
                        }
                    });
                }
            } catch (error) {
                if (axios.isAxiosError(error))
                    toast.error(error.response?.data?.message);
                else toast.error("Something went wrong.");
            } finally {
                stop();
            }
        };
        const getProjectTasks = async () => {
            try {
                if (!projectId) return;

                const response: AxiosResponse | undefined =
                    await API_PROJECT_ENDPOINTS.getProjectTasks(projectId);

                if (response?.status === 200) {
                    const tasksByCategory: ProjectTasks = {
                        todo: [],
                        in_progress: [],
                        done: [],
                    };

                    const tasks = response.data.data as Task[];

                    for (const task of tasks) {
                        if (task.status === "todo")
                            tasksByCategory?.todo.push(task);
                        else if (task.status === "in_progress")
                            tasksByCategory?.in_progress.push(task);
                        else if (task.status === "done")
                            tasksByCategory?.done.push(task);
                    }

                    setStore((prev) => ({
                        ...prev,
                        projectTasks: {
                            ...prev.projectTasks,
                            [projectId]: tasksByCategory,
                        },
                    }));
                }
            } catch (error) {
                if (axios.isAxiosError(error))
                    toast.error(error.response?.data?.message);
                else toast.error("Something went wrong.");
            }
        };
        const getProjectMembers = async () => {
            if (projectId) {
                try {
                    const response: AxiosResponse | undefined =
                        await API_PROJECT_ENDPOINTS.getProjectMembers(
                            projectId,
                        );

                    if (response?.status === 200) {
                        const members = response.data.data as ProjectMember[];
                        setStore((prev) => ({
                            ...prev,
                            projectMembers: {
                                ...prev.projectMembers,
                                [projectId]: members,
                            },
                        }));
                    }
                } catch (error) {
                    if (axios.isAxiosError(error))
                        toast.error(error.response?.data?.message);
                    else toast.error("Something went wrong.");
                }
            }
        };

        withLoading(async () => {
            await getProject();
            await getProjectTasks();
            await getProjectMembers();
            stop();
        });
    }, [projectId]);

    useEffect(() => {
        const getProjectNotes = async () => {
            if (!projectId) return;
            try {
                const response: AxiosResponse | undefined =
                    await API_NOTE_ENDPOINTS.getProjectNotes({ projectId });

                if (response.data.statusCode === 200) {
                    const notes = response.data.data as Note[];

                    setStore((prev) => ({
                        ...prev,
                        projectNotes: {
                            ...prev.projectNotes,
                            [projectId]: notes,
                        },
                    }));
                }
            } catch (error) {
                if (axios.isAxiosError(error))
                    toast.error(error.response?.data?.message);
                else toast.error("Something went wrong.");
            }
        };

        getProjectNotes();
    }, [projectId]);

    return (
        <>
            {loading ? (
                <Loading message="Loading project details..." />
            ) : (
                <div className="flex-1 flex flex-col min-h-0">
                    {/* Project header */}
                    {activeProject && (
                        <Card className="mb-6 border-0 bg-gradient-to-r from-indigo-50/80 to-blue-50/80 dark:from-indigo-950/30 dark:to-blue-950/30 shadow-sm">
                            <div className="px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-50">
                                            {activeProject.name}
                                        </h1>{" "}
                                        <Badge
                                            variant="outline"
                                            className="bg-blue-100/50 dark:bg-blue-900/50 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                                        >
                                            {store.projectMembers[projectId!]
                                                ?.length || 0}{" "}
                                            Members
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground mt-1">
                                        {activeProject.description}
                                    </p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="text-xs bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                                        <span>
                                            Created{" "}
                                            {new Date(
                                                activeProject.createdAt,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <Badge className="bg-indigo-500">
                                        {calculateCompletionRate(
                                            store.projectTasks[projectId!],
                                        )}
                                        % Complete
                                    </Badge>
                                </div>
                            </div>
                        </Card>
                    )}

                    <Tabs
                        defaultValue={tab}
                        onValueChange={handleTabChange}
                        className="flex-1 flex flex-col min-h-0"
                    >
                        <TabsList className="w-full h-12 bg-background/80 backdrop-blur-sm sticky top-0 z-10 border-b">
                            <TabsTrigger
                                value="kanban"
                                className={cn(
                                    "data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
                                    "flex items-center gap-2 transition-all",
                                )}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-layout-grid"
                                >
                                    <rect
                                        width="7"
                                        height="7"
                                        x="3"
                                        y="3"
                                        rx="1"
                                    />
                                    <rect
                                        width="7"
                                        height="7"
                                        x="14"
                                        y="3"
                                        rx="1"
                                    />
                                    <rect
                                        width="7"
                                        height="7"
                                        x="14"
                                        y="14"
                                        rx="1"
                                    />
                                    <rect
                                        width="7"
                                        height="7"
                                        x="3"
                                        y="14"
                                        rx="1"
                                    />
                                </svg>
                                Kanban Board
                            </TabsTrigger>
                            <TabsTrigger
                                value="tasklist"
                                className={cn(
                                    "data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
                                    "flex items-center gap-2 transition-all",
                                )}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-list-checks"
                                >
                                    <path d="m3 17 2 2 4-4" />
                                    <path d="m3 7 2 2 4-4" />
                                    <path d="M13 6h8" />
                                    <path d="M13 12h8" />
                                    <path d="M13 18h8" />
                                </svg>
                                List View
                            </TabsTrigger>
                            <TabsTrigger
                                value="members"
                                className={cn(
                                    "data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
                                    "flex items-center gap-2 transition-all",
                                )}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-users"
                                >
                                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                                    <circle cx="9" cy="7" r="4" />
                                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                                </svg>
                                Members
                            </TabsTrigger>
                            <TabsTrigger
                                value="notes"
                                className={cn(
                                    "data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
                                    "flex items-center gap-2 transition-all",
                                )}
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    className="lucide lucide-clipboard-list"
                                >
                                    <rect
                                        width="8"
                                        height="4"
                                        x="8"
                                        y="2"
                                        rx="1"
                                        ry="1"
                                    />
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    <path d="M12 11h4" />
                                    <path d="M12 16h4" />
                                    <path d="M8 11h.01" />
                                    <path d="M8 16h.01" />
                                </svg>
                                Notes
                            </TabsTrigger>
                        </TabsList>

                        <div className="p-4 flex-1">
                            <TabsContent
                                value="kanban"
                                className="flex flex-1 gap-4 min-h-0 min-w-0 mt-0"
                            >
                                <ProjectKanbanTab />
                            </TabsContent>
                            <TabsContent value="tasklist" className="mt-0">
                                <ProjectTasklistTab />
                            </TabsContent>
                            <TabsContent value="members" className="mt-0">
                                <ProjectMembersTab projectId={projectId} />
                            </TabsContent>
                            <TabsContent value="notes" className="mt-0">
                                <ProjectNotesTab />
                            </TabsContent>
                        </div>
                    </Tabs>
                </div>
            )}
        </>
    );
}
