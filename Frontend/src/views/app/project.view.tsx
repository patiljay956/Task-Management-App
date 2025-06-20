import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectMembersTab from "../tabs/project-members-tab";
import { useNavigate, useParams } from "react-router";
import ProjectTasklistTab from "../tabs/project-tasklist-tab";
import ProjectKanbanTab from "../tabs/project-kanban-tab";
import { useStore } from "@/components/contexts/store-provider";
import { useEffect } from "react";
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

type Props = {
    tab: "members" | "tasklist" | "kanban" | "notes";
};

export default function ProjectView({ tab = "kanban" }: Props) {
    const { projectId } = useParams<{ projectId: string }>();
    const { setStore } = useStore();
    const navigate = useNavigate();

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
            }
        };

        getProject();
    }, []);

    useEffect(() => {
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

        getProjectTasks();
    }, []);

    useEffect(() => {
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

        getProjectMembers();
    }, []);

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
    }, []);

    return (
        <Tabs
            defaultValue={tab}
            onValueChange={handleTabChange}
            className="flex-1 flex flex-col min-h-0"
        >
            <TabsList>
                <TabsTrigger value="kanban">Kanban Board</TabsTrigger>
                <TabsTrigger value="tasklist">List View</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>
            <TabsContent
                value="kanban"
                className="flex flex-1 gap-4 min-h-0 min-w-0"
            >
                <ProjectKanbanTab />
            </TabsContent>
            <TabsContent value="tasklist">
                <ProjectTasklistTab />
            </TabsContent>
            <TabsContent value="members">
                <ProjectMembersTab projectId={projectId} />
            </TabsContent>
            <TabsContent value="notes">
                <ProjectNotesTab />
            </TabsContent>
        </Tabs>
    );
}
