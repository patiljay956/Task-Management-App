// components/task/task-details-view.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubtaskSection } from "@/components/task/sub-task-section";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { TaskFileSection } from "@/components/task/file-section";
import { mockTaskFiles } from "@/components/task/dummy";
import { useEffect, useState } from "react";
import axios, { type AxiosResponse } from "axios";
import { toast } from "sonner";
import { API_PROJECT_ENDPOINTS, API_TASK_ENDPOINTS } from "@/api/endpoints";
import { useParams } from "react-router";
import { useStore } from "@/components/contexts/store-provider";
import type { ProjectTasks, SubTask, Task } from "@/types/project";
import { Input } from "@/components/ui/input";

type Props = {};

export const TaskView = ({}: Props) => {
    const { projectId, taskId } = useParams<{
        projectId: string;
        taskId: string;
    }>();

    const { store, setStore } = useStore();
    const [task, setTask] = useState<Task | null>(null);
    const [subtasks, setSubtasks] = useState<SubTask[] | null>(null);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>("");

    useEffect(() => {
        const getSubtasksByTaskId = async () => {
            try {
                const response = await API_TASK_ENDPOINTS.getSubTasks({
                    taskId: taskId!,
                    projectId: projectId!,
                });

                if (response.data.statusCode === 200) {
                    const subtasks = response.data.data;

                    setSubtasks(subtasks!);

                    setStore((prev) => {
                        return {
                            ...prev,
                            projectTaskSubTasks: {
                                ...prev.projectTaskSubTasks,
                                [projectId!]: {
                                    ...prev.projectTaskSubTasks[projectId!],
                                    [taskId!]: subtasks,
                                },
                            },
                        };
                    });
                }
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    toast.error(error.response?.data?.message);
                } else {
                    toast.error(
                        "Something went wrong. Please try again later.",
                    );
                }
            }
        };
        getSubtasksByTaskId();
    }, [projectId, taskId]);

    useEffect(() => {
        if (
            store.projectTaskSubTasks[projectId!] &&
            store.projectTaskSubTasks[projectId!][taskId!]
        ) {
            setSubtasks(store.projectTaskSubTasks[projectId!][taskId!]);
        }

        if (store.projectTasks[projectId!]) {
            setTask(() => {
                const allTasks = [
                    ...store.projectTasks[projectId!].todo,
                    ...store.projectTasks[projectId!].in_progress,
                    ...store.projectTasks[projectId!].done,
                ];

                return allTasks.find((task) => task._id === taskId) ?? null;
            });
        }
    }, [store.projectTaskSubTasks, store.projectTasks]);

    useEffect(() => {
        if (!projectId) return;

        if (!taskId) return;

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

                    const task = tasks.find((task) => task._id === taskId);

                    setTask(task!);

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
    }, [projectId, taskId]);

    const handleAddSubtask = async (value: string) => {
        try {
            const response = await API_TASK_ENDPOINTS.addSubTask({
                projectId: projectId!,
                taskId: taskId!,
                title: value,
            });

            if (response.data.statusCode === 201) {
                const subtask = response.data.data;

                setStore((prev) => {
                    return {
                        ...prev,
                        projectTaskSubTasks: {
                            ...prev.projectTaskSubTasks,
                            [projectId!]: {
                                ...prev.projectTaskSubTasks[projectId!],
                                [taskId!]: [
                                    ...prev.projectTaskSubTasks[projectId!][
                                        taskId!
                                    ],
                                    subtask,
                                ],
                            },
                        },
                    };
                });

                setNewSubtaskTitle("");
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                toast.error(error.response?.data?.message);
            else toast.error("Something went wrong.");
        }
    };

    return (
        <Card className="w-full max-w-2xl rounded-2xl shadow-md mx-auto">
            <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle className="text-xl">{task?.title}</CardTitle>
                        <p className="text-sm text-muted-foreground">
                            {task?.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline">{task?.status}</Badge>
                            <Badge variant="secondary">{task?.priority}</Badge>
                        </div>
                    </div>
                    <Button size="icon" variant="ghost" title="Edit Task">
                        <Pencil className="w-4 h-4" />
                    </Button>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <SubtaskSection
                        title="Subtasks"
                        subtasks={subtasks}
                        emptyText="No subtasks start by adding one"
                    />

                    {/* Add Subtask Input */}
                    <div className="flex items-center gap-2">
                        <Input
                            value={newSubtaskTitle}
                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            placeholder="Add a subtask..."
                            className="h-8"
                        />
                        <Button
                            size="sm"
                            onClick={() => {
                                if (!newSubtaskTitle.trim()) return;

                                handleAddSubtask(newSubtaskTitle.trim());
                                setNewSubtaskTitle("");
                            }}
                        >
                            <Plus className="w-4 h-4 mr-1" />
                            Add
                        </Button>
                    </div>
                </div>
                <TaskFileSection
                    files={mockTaskFiles}
                    onDelete={(fileId) => {}}
                    onUpload={(files) => {}}
                />
            </CardContent>
        </Card>
    );
};
