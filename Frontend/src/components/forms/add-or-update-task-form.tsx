// components/tasklist/task-form.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormControl,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useMemo } from "react";
import type { Task, KanbanColumnKey, ProjectMember } from "@/types/project";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { taskFormSchema } from "@/schemas/add-or-update-task-form.schema";
import { LoaderCircle } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import { useParams } from "react-router";
import { useStore } from "../contexts/store-provider";
import { FilePreviewList } from "../task/file-preview-list";

type TaskFormSchema = z.infer<typeof taskFormSchema>;

type Props = {
    initialData?: Task | null;
    onSuccess?: () => void;
    status?: KanbanColumnKey;
    projectMembers?: ProjectMember[];
};

export default function AddOrUpdateTaskForm({
    initialData,
    onSuccess,
    status,
    projectMembers,
}: Props) {
    const { projectId } = useParams<{ projectId: string }>();
    const { store, setStore } = useStore();

    const members = useMemo(() => {
        return projectMembers || store.projectMembers[projectId!] || [];
    }, [store.projectMembers, projectId]);

    const form = useForm<TaskFormSchema>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: "",
            description: "",
            status: initialData?.status || status || "todo",
            priority: initialData?.priority || "low",
            assignedTo: "",
            files: [],
        },
    });

    // Populate form on edit
    useEffect(() => {
        if (initialData) {
            form.reset({
                title: initialData.title,
                description: initialData.description,
                status: initialData.status,
                priority: initialData.priority,
                assignedTo: initialData.assignedTo?._id ?? "",
                files: [],
            });
        }
    }, [initialData]);

    const onSubmit = async (values: TaskFormSchema) => {
        try {
            if (initialData) {
                const response = await API_PROJECT_ENDPOINTS.updateTask({
                    projectId: projectId!,
                    taskId: initialData._id,
                    title: values.title,
                    description: values.description,
                    assignedTo: values.assignedTo,
                    status: values.status,
                    priority: values.priority,
                    files: values.files,
                });

                if (response.data.statusCode === 200) {
                    toast.success("Task updated successfully!");
                    form.reset();
                    onSuccess?.();

                    const updatedTask = response.data.data;

                    setStore((prev) => {
                        const prevStatus = initialData.status; // status before update
                        const newStatus = values.status;

                        // Ensure the store structure exists with proper defaults
                        const currentProjectTasks = prev.projectTasks?.[
                            projectId!
                        ] || {
                            todo: [],
                            doing: [],
                            done: [],
                        };
                        const prevTasks = currentProjectTasks[prevStatus] || [];
                        const newTasks = currentProjectTasks[newStatus] || [];

                        // Remove from old status
                        const cleanedPrevTasks = prevTasks.filter(
                            (task) => task._id !== initialData._id,
                        );

                        // Update or add to new status
                        const taskIndex = newTasks.findIndex(
                            (task) => task._id === initialData._id,
                        );

                        const updatedNewTasks =
                            taskIndex !== -1
                                ? newTasks.map((task) =>
                                      task._id === initialData._id
                                          ? updatedTask
                                          : task,
                                  )
                                : [...newTasks, updatedTask];

                        return {
                            ...prev,
                            projectTasks: {
                                ...prev.projectTasks,
                                [projectId!]: {
                                    ...currentProjectTasks,
                                    [prevStatus]: cleanedPrevTasks,
                                    [newStatus]: updatedNewTasks,
                                },
                            },
                        };
                    });
                }
            } else {
                const response = await API_PROJECT_ENDPOINTS.addTask({
                    projectId: projectId!,
                    title: values.title,
                    description: values.description,
                    assignedTo: values.assignedTo,
                    status: values.status,
                    priority: values.priority,
                    files: values.files,
                });

                if (response.data.statusCode === 201) {
                    toast.success("Task added successfully!");
                    form.reset();
                    onSuccess?.();

                    setStore((prev) => {
                        // Safe access to project members with fallback
                        const projectMembers =
                            prev.projectMembers?.[projectId!] || [];

                        const assignedBy = projectMembers.find(
                            (member) =>
                                member._id === response.data.data.assignedBy,
                        );

                        const assignedTo = projectMembers.find(
                            (member) =>
                                member._id === response.data.data.assignedTo,
                        );

                        const newTask: Task = {
                            ...response.data.data,
                            assignedBy: assignedBy || undefined,
                            assignedTo: assignedTo || undefined,
                        };

                        // Ensure the store structure exists with proper defaults
                        const currentProjectTasks = prev.projectTasks?.[
                            projectId!
                        ] || {
                            todo: [],
                            doing: [],
                            done: [],
                        };
                        const currentStatusTasks =
                            currentProjectTasks[values.status] || [];

                        return {
                            ...prev,
                            projectTasks: {
                                ...prev.projectTasks,
                                [projectId!]: {
                                    ...currentProjectTasks,
                                    [values.status]: [
                                        ...currentStatusTasks,
                                        newTask,
                                    ],
                                },
                            },
                        };
                    });
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                toast.error(error.response?.data?.message);
            else toast.error("Something went wrong. Please try again later.");
        }
        onSuccess?.();
    };

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 pt-2"
            >
                {" "}
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-green-700 dark:text-green-400">
                                Task Title
                            </FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    placeholder="Enter a descriptive title for your task"
                                    className="border-green-500/30 focus:ring-green-500/20 focus:border-green-500 bg-green-500/5"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className="text-green-700 dark:text-green-400">
                                Task Description
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    {...field}
                                    rows={4}
                                    placeholder="Provide details about what needs to be done"
                                    className="border-green-500/30 focus:ring-green-500/20 focus:border-green-500 bg-green-500/5"
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />{" "}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-green-700 dark:text-green-400">
                                    Task Status
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="border-green-500/30 focus:ring-green-500/20 focus:border-green-500 bg-green-500/5">
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="border-green-500/30">
                                        {Object.values({
                                            todo: "todo",
                                            in_progress: "in_progress",
                                            done: "done",
                                        }).map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                                className="hover:bg-green-500/10 focus:bg-green-500/10"
                                            >
                                                <span className="capitalize">
                                                    {status.replace("_", " ")}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="priority"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-green-700 dark:text-green-400">
                                    Task Priority
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="border-green-500/30 focus:ring-green-500/20 focus:border-green-500 bg-green-500/5">
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="border-green-500/30">
                                        {Object.values({
                                            low: "low",
                                            medium: "medium",
                                            high: "high",
                                        }).map((priority) => (
                                            <SelectItem
                                                key={priority}
                                                value={priority}
                                                className="hover:bg-green-500/10 focus:bg-green-500/10"
                                            >
                                                <span className="capitalize">
                                                    {priority}
                                                </span>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="assignedTo"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-green-700 dark:text-green-400">
                                    Assigned To
                                </FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger className="border-green-500/30 focus:ring-green-500/20 focus:border-green-500 bg-green-500/5">
                                            <SelectValue placeholder="Select team member" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent className="border-green-500/30">
                                        {members.map((member) => (
                                            <SelectItem
                                                key={member._id}
                                                value={member._id}
                                                className="hover:bg-green-500/10 focus:bg-green-500/10"
                                            >
                                                {member.user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />{" "}
                    <FormField
                        control={form.control}
                        name="files"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-green-700 dark:text-green-400">
                                    Task Attachments
                                </FormLabel>
                                <FormControl>
                                    <div className="border-2 border-dashed border-green-500/30 rounded-lg p-4 bg-green-500/5 hover:bg-green-500/10 transition-colors">
                                        <Input
                                            type="file"
                                            multiple
                                            onChange={(e) =>
                                                field.onChange(e.target.files)
                                            }
                                            className="border-none bg-transparent file:bg-green-500/10 file:text-green-600 file:border-0 file:rounded-md file:px-3 file:py-2 file:font-medium hover:file:bg-green-500/20 cursor-pointer"
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FilePreviewList
                    files={Array.from(form.watch("files") ?? [])}
                    onRemove={(idx) => {
                        const currentFiles = Array.from(
                            form.watch("files") ?? [],
                        );
                        currentFiles.splice(idx, 1);
                        form.setValue("files", currentFiles, {
                            shouldValidate: true,
                        });
                    }}
                />{" "}
                <div className="flex justify-end">
                    <Button
                        disabled={form.formState.isSubmitting}
                        type="submit"
                        className="gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 border-none shadow-md"
                    >
                        {form.formState.isSubmitting && (
                            <LoaderCircle className="animate-spin h-4 w-4" />
                        )}
                        {initialData ? "Update Task" : "Create Task"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
