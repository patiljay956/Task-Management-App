// components/task/task-details-view.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { SubtaskSection } from "@/components/task/sub-task-section";
import { Button } from "@/components/ui/button";
import { Pencil, Plus } from "lucide-react";
import { TaskFileSection } from "@/components/task/file-section";
import { useEffect, useState } from "react";
import axios, { type AxiosResponse } from "axios";
import { toast } from "sonner";
import { API_PROJECT_ENDPOINTS, API_TASK_ENDPOINTS } from "@/api/endpoints";
import { Link, useParams } from "react-router";
import { useStore } from "@/components/contexts/store-provider";
import type { ProjectTasks, SubTask, Task } from "@/types/project";
import { Input } from "@/components/ui/input";
import AddOrUpdateTaskDialog from "@/components/dialogs/add-or-update-task-dialog";
import { BASE_URL } from "@/constants/app-routes";
import { cn } from "@/lib/utils";

type Props = {};

const statusTheme = {
    todo: {
        bg: "from-blue-50/80 to-blue-100/80 dark:from-blue-950/40 dark:to-blue-900/30",
        border: "border-blue-200 dark:border-blue-800",
        title: "from-blue-600 to-blue-400 dark:from-blue-400 dark:to-blue-300",
        badge: "bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300",
        button: "from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700",
    },
    in_progress: {
        bg: "from-yellow-50/80 to-yellow-100/80 dark:from-yellow-950/40 dark:to-yellow-900/30",
        border: "border-yellow-200 dark:border-yellow-800",
        title: "from-yellow-600 to-yellow-400 dark:from-yellow-400 dark:to-yellow-300",
        badge: "bg-yellow-50/50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-800 text-yellow-700 dark:text-yellow-300",
        button: "from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600",
    },
    done: {
        bg: "from-emerald-50/80 to-emerald-100/80 dark:from-emerald-950/40 dark:to-emerald-900/30",
        border: "border-emerald-200 dark:border-emerald-800",
        title: "from-emerald-600 to-emerald-400 dark:from-emerald-400 dark:to-emerald-300",
        badge: "bg-emerald-50/50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300",
        button: "from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700",
    },
};

export const TaskView = ({}: Props) => {
    const { projectId, taskId } = useParams<{
        projectId: string;
        taskId: string;
    }>();

    const { store, setStore } = useStore();
    const [task, setTask] = useState<Task | null>(null);
    const [subtasks, setSubtasks] = useState<SubTask[] | null>(null);
    const [newSubtaskTitle, setNewSubtaskTitle] = useState<string>("");
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

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
                    // Ensure the store structure exists with proper defaults
                    const currentProjectSubTasks =
                        prev.projectTaskSubTasks?.[projectId!] || {};
                    const currentTaskSubTasks =
                        currentProjectSubTasks[taskId!] || [];

                    return {
                        ...prev,
                        projectTaskSubTasks: {
                            ...prev.projectTaskSubTasks,
                            [projectId!]: {
                                ...currentProjectSubTasks,
                                [taskId!]: [...currentTaskSubTasks, subtask],
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

    const onUploadHandler = async (files: FileList) => {
        const fileList = Array.from(files);
        if (!fileList) return;
        if (fileList.length > 5)
            return toast.error("You can only upload 5 files at a time.");

        try {
            setIsSubmitting(true);
            const response = await API_PROJECT_ENDPOINTS.uploadFiles({
                taskId: taskId!,
                projectId: projectId!,
                files: fileList,
            });

            if (response.data.statusCode === 200) {
                const task = response.data.data as Task;
                setStore((prev) => {
                    const oldtTasks =
                        prev.projectTasks[projectId!][task.status];

                    // remove task with same id from the old tasks array
                    const newTasks = oldtTasks?.filter(
                        (t) => t._id !== task._id,
                    );

                    // add new task to the new tasks array
                    newTasks?.push(task);

                    return {
                        ...prev,
                        projectTasks: {
                            ...prev.projectTasks,
                            [projectId!]: {
                                ...prev.projectTasks[projectId!],
                                [task.status]: newTasks,
                            },
                        },
                    };
                });

                toast.success("Files uploaded successfully.");
                setIsSubmitting(false);
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                toast.error(error.response?.data?.message);
            else toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const onFileDeleteHandler = async (fileId: string) => {
        try {
            const response = await API_PROJECT_ENDPOINTS.deleteTaskAttachment({
                projectId: projectId!,
                taskId: taskId!,
                attachmentId: fileId,
            });

            if (response.data.statusCode === 200) {
                const task = response.data.data as Task;
                toast.success("File deleted successfully.");
                setStore((prev) => {
                    // Ensure the store structure exists with proper defaults
                    const currentProjectTasks = prev.projectTasks?.[
                        projectId!
                    ] || {
                        todo: [],
                        in_progress: [],
                        done: [],
                    };
                    const oldTasks = currentProjectTasks[task.status] || [];

                    // Remove task with same id from the old tasks array and add the updated task
                    const newTasks = oldTasks
                        .filter((t) => t._id !== task._id)
                        .concat(task);

                    return {
                        ...prev,
                        projectTasks: {
                            ...prev.projectTasks,
                            [projectId!]: {
                                ...currentProjectTasks,
                                [task.status]: newTasks,
                            },
                        },
                    };
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                toast.error(error.response?.data?.message);
            else toast.error("Something went wrong.");
        }
    };

    const theme = statusTheme[task?.status || "todo"];

    return (
        <Card
            className={`
    w-full max-w-2xl rounded-2xl shadow-md mx-auto border-0
    bg-gradient-to-br ${theme.bg} ${theme.border}
`}
        >
            <CardHeader
                className={`pb-3 border-b ${theme.border} bg-gradient-to-br from-background via-background to-transparent`}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <CardTitle
                            className={`text-xl bg-gradient-to-r ${theme.title} bg-clip-text text-transparent`}
                        >
                            {task?.title + " : "}
                            <Link
                                to={`${BASE_URL}/project/${task?.project?._id}/kanban`}
                            >
                                <span className="text-cyan-700 dark:text-cyan-300 underline font-semibold">
                                    {task?.project?.name}
                                </span>
                            </Link>
                        </CardTitle>
                        <p className="text-sm text-muted-foreground mt-1">
                            {task?.description}
                        </p>
                        <div className="flex gap-2 mt-2">
                            <Badge variant="outline" className={theme.badge}>
                                {task?.status}
                            </Badge>
                            <Badge
                                variant="secondary"
                                className={cn(
                                    task?.priority === "high"
                                        ? "bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-900/20 dark:text-rose-400 dark:border-rose-800/30"
                                        : task?.priority === "medium"
                                        ? "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800/30"
                                        : task?.priority === "low"
                                        ? "bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-400 dark:border-emerald-800/30"
                                        : "bg-slate-50 text-slate-500 border-slate-200 dark:bg-slate-900/20 dark:text-slate-400 dark:border-slate-800/30",
                                )}
                            >
                                {task?.priority}
                            </Badge>
                        </div>
                    </div>
                    <AddOrUpdateTaskDialog
                        initialData={task}
                        projectMembers={store.projectMembers[projectId!] || []}
                    >
                        <Button
                            size="icon"
                            variant="ghost"
                            title="Edit Task"
                            className="hover:bg-cyan-100 hover:text-cyan-600 dark:hover:bg-cyan-900/20 rounded-full transition-colors"
                        >
                            <Pencil className="w-4 h-4" />
                        </Button>
                    </AddOrUpdateTaskDialog>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <SubtaskSection
                        title="Subtasks"
                        subtasks={subtasks}
                        emptyText="No subtasks start by adding one"
                        status={task?.status || "todo"}
                    />

                    {/* Add Subtask Input */}
                    <div className="flex items-center gap-2">
                        <Input
                            value={newSubtaskTitle}
                            onChange={(e) => setNewSubtaskTitle(e.target.value)}
                            placeholder="Add a subtask..."
                            className={`
        h-8 bg-white/80 dark:bg-slate-900/80
        border ${theme.border}
        focus:ring-2 focus:ring-offset-0 focus:${theme.button.split(" ")[0]}
        transition-colors
    `}
                        />
                        <Button
                            size="sm"
                            className={`
                bg-gradient-to-r ${theme.button}
                text-white font-semibold
            `}
                            onClick={() => {
                                if (!newSubtaskTitle.trim()) return;
                                handleAddSubtask(newSubtaskTitle.trim());
                                setNewSubtaskTitle("");
                            }}
                        >
                            <Plus className="w-4 h-4" />
                            Add
                        </Button>
                    </div>
                </div>
                <TaskFileSection
                    files={task?.attachments || []}
                    onDelete={onFileDeleteHandler}
                    onUpload={onUploadHandler}
                    isSubmitting={isSubmitting}
                />
            </CardContent>
        </Card>
    );
};
