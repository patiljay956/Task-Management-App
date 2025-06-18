import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import { useStore } from "@/components/contexts/store-provider";
import TaskTable from "@/components/tasklist/task-table";
import { useAuth } from "@/hooks/use-auth";
import type { ProjectTasks, Task } from "@/types/project";
import axios from "axios";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";

type Props = {};

export default function UserTasksView({}: Props) {
    const { store, setStore } = useStore();
    const { user } = useAuth();

    useEffect(() => {
        const getUserTasks = async () => {
            try {
                const response = await API_PROJECT_ENDPOINTS.getUserTasks();

                if (response?.data.statusCode !== 200) {
                    return;
                }

                const tasks = response.data.data as Task[];
                const groupedTasks = groupTasksByProject(tasks);

                setStore((prev) => ({
                    ...prev,
                    projectTasks: {
                        ...prev.projectTasks,
                        ...groupedTasks,
                    },
                }));
            } catch (error) {
                if (axios.isAxiosError(error))
                    toast.error(error.response?.data?.message);
                else
                    toast.error(
                        "Something went wrong. Please try again later.",
                    );
            }
        };

        const groupTasksByProject = (
            tasks: Task[],
        ): { [key: string]: ProjectTasks } => {
            const groupedTasks: { [key: string]: ProjectTasks } = {};

            for (const task of tasks) {
                if (!task.project?._id) continue;

                const projectId = task.project._id;

                // Initialize project tasks if not exists
                if (!groupedTasks[projectId]) {
                    groupedTasks[projectId] = initializeProjectTasks(projectId);
                }

                // Add task to appropriate status array
                addTaskToStatus(groupedTasks[projectId], task);
            }

            return groupedTasks;
        };

        const initializeProjectTasks = (projectId: string): ProjectTasks => ({
            todo: [...(store.projectTasks[projectId]?.todo || [])],
            in_progress: [
                ...(store.projectTasks[projectId]?.in_progress || []),
            ],
            done: [...(store.projectTasks[projectId]?.done || [])],
        });

        const addTaskToStatus = (projectTasks: ProjectTasks, task: Task) => {
            switch (task.status) {
                case "todo":
                    projectTasks.todo.push(task);
                    break;
                case "in_progress":
                    projectTasks.in_progress.push(task);
                    break;
                case "done":
                    projectTasks.done.push(task);
                    break;
            }
        };

        getUserTasks();
    }, []);

    const userTasks = useMemo(() => {
        const taskList: Task[] = [];

        for (const projectId in store.projectTasks) {
            const projectTasks = store.projectTasks[projectId!];
            taskList.push(
                projectTasks.todo.find(
                    (task) => task.assignedTo?.user._id === user._id,
                )!,
            );
            taskList.push(
                projectTasks.in_progress.find(
                    (task) => task.assignedTo?.user._id === user._id,
                )!,
            );
            taskList.push(
                projectTasks.done.find(
                    (task) => task.assignedTo?.user._id === user._id,
                )!,
            );
        }

        return taskList.filter((task) => task);
    }, [store.projectTasks]);

    return (
        <>
            <TaskTable data={userTasks}></TaskTable>
        </>
    );
}
