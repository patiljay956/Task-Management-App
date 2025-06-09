import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ProjectMembersTab from "../tabs/project-members-tab";
import { useParams } from "react-router";
import ProjectTasklistTab from "../tabs/project-tasklist-tab";
import ProjectKanbanTab from "../tabs/project-kanban-tab";
import { useStore } from "@/components/contexts/store-provider";
import { useEffect } from "react";
import type { AxiosResponse } from "axios";
import type { ProjectMember, ProjectTasks, Task } from "@/types/project";
import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import axios from "axios";
import { toast } from "sonner";

type Props = {};

export default function ProjectView({}: Props) {
    const { projectId } = useParams<{ projectId: string }>();
    const { setStore } = useStore();

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

                    console.log(response);

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

    return (
        <Tabs
            defaultValue="kanban-board"
            className="flex-1 flex flex-col min-h-0"
        >
            <TabsList>
                <TabsTrigger value="kanban-board">Kanban Board</TabsTrigger>
                <TabsTrigger value="list-view">List View</TabsTrigger>
                <TabsTrigger value="members">Members</TabsTrigger>
            </TabsList>
            <TabsContent
                value="kanban-board"
                className="flex flex-1 gap-4 min-h-0 min-w-0"
            >
                <ProjectKanbanTab />
            </TabsContent>
            <TabsContent value="list-view">
                <ProjectTasklistTab />
            </TabsContent>
            <TabsContent value="members">
                <ProjectMembersTab projectId={projectId} />
            </TabsContent>
        </Tabs>
    );
}
