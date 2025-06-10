import type { SubTask } from "@/types/project";
import { SubtaskItem } from "./sub-task-item";
import { useParams } from "react-router";
import { useStore } from "../contexts/store-provider";
import type { AxiosResponse } from "axios";
import { API_TASK_ENDPOINTS } from "@/api/endpoints";
import { toast } from "sonner";
import axios from "axios";

type Props = {
    title: string;
    emptyText: string;
    subtasks: SubTask[] | null;
};

export const SubtaskSection = ({ title, emptyText, subtasks }: Props) => {
    const { projectId, taskId } = useParams<{
        projectId: string;
        taskId: string;
    }>();

    const { store, setStore } = useStore();

    const handleToggle = async (subtask: SubTask, checked: boolean) => {
        if (!subtask?._id) return;

        //update local
        setStore((prev) => {
            return {
                ...prev,
                projectTaskSubTasks: {
                    ...prev.projectTaskSubTasks,
                    [projectId!]: {
                        ...prev.projectTaskSubTasks[projectId!],
                        [taskId!]: prev.projectTaskSubTasks[projectId!][
                            taskId!
                        ].map((s) => {
                            if (s._id === subtask._id) {
                                return {
                                    ...s,
                                    isCompleted: checked,
                                };
                            }
                            return s;
                        }),
                    },
                },
            };
        });

        //old State
        const subtasks = store.projectTaskSubTasks[projectId!][taskId!];

        //update server
        try {
            const response: AxiosResponse | undefined =
                await API_TASK_ENDPOINTS.updateSubTask({
                    taskId: taskId!,
                    projectId: projectId!,
                    subtaskId: subtask._id,
                    title: subtask.title,
                    isCompleted: checked,
                });

            if (response.data.statusCode === 200) {
                toast.success("Subtask updated successfully!");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
                setStore((prev) => {
                    return {
                        ...prev,
                        projectTaskSubTasks: {
                            ...prev.projectTaskSubTasks,
                            [projectId!]: {
                                ...prev.projectTaskSubTasks[projectId!],
                                [taskId!]: [...subtasks],
                            },
                        },
                    };
                });
            } else toast.error("Something went wrong. Please try again later.");
        }
    };

    const handleUpdate = async (subtask: SubTask, newTitle: string) => {
        if (!subtask?._id) return;

        //update local
        setStore((prev) => {
            return {
                ...prev,
                projectTaskSubTasks: {
                    ...prev.projectTaskSubTasks,
                    [projectId!]: {
                        ...prev.projectTaskSubTasks[projectId!],
                        [taskId!]: prev.projectTaskSubTasks[projectId!][
                            taskId!
                        ].map((s) => {
                            if (s._id === subtask._id) {
                                return {
                                    ...s,
                                    title: newTitle,
                                };
                            }
                            return s;
                        }),
                    },
                },
            };
        });

        //old State
        const subtasks = store.projectTaskSubTasks[projectId!][taskId!];

        //update server
        try {
            const response: AxiosResponse | undefined =
                await API_TASK_ENDPOINTS.updateSubTask({
                    taskId: taskId!,
                    projectId: projectId!,
                    subtaskId: subtask._id,
                    title: newTitle,
                    isCompleted: subtask.isCompleted,
                });

            if (response.data.statusCode === 200) {
                toast.success("Subtask updated successfully!");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
                setStore((prev) => {
                    console.log("Here");
                    return {
                        ...prev,
                        projectTaskSubTasks: {
                            ...prev.projectTaskSubTasks,
                            [projectId!]: {
                                ...prev.projectTaskSubTasks[projectId!],
                                [taskId!]: [...subtasks],
                            },
                        },
                    };
                });
            } else toast.error("Something went wrong. Please try again later.");
        }
    };

    const handleDelete = async (subtask: SubTask) => {
        if (!subtask?._id) return;
        //update local
        setStore((prev) => {
            return {
                ...prev,
                projectTaskSubTasks: {
                    ...prev.projectTaskSubTasks,
                    [projectId!]: {
                        ...prev.projectTaskSubTasks[projectId!],
                        [taskId!]: prev.projectTaskSubTasks[projectId!][
                            taskId!
                        ].filter((s) => s._id !== subtask._id),
                    },
                },
            };
        });

        //update server
        try {
            const response: AxiosResponse | undefined =
                await API_TASK_ENDPOINTS.deleteSubTask({
                    taskId: taskId!,
                    projectId: projectId!,
                    subtaskId: subtask._id,
                });

            if (response.data.statusCode === 200) {
                toast.success("Subtask deleted successfully!");
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error(error.response?.data?.message);
            } else toast.error("Something went wrong. Please try again later.");
        }
    };

    return (
        <div>
            <h3 className="font-semibold text-sm text-muted-foreground mb-2">
                {title}
            </h3>
            {!subtasks ? (
                <p className="text-xs text-muted-foreground italic">
                    {emptyText}
                </p>
            ) : (
                <ul className="space-y-2">
                    {subtasks?.map((subtask) => (
                        <SubtaskItem
                            key={subtask._id}
                            subtask={subtask}
                            onToggle={handleToggle}
                            onUpdate={handleUpdate}
                            onDelete={handleDelete}
                        />
                    ))}
                </ul>
            )}
        </div>
    );
};
