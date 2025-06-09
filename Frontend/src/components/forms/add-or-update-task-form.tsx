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
import { useEffect } from "react";
import type { Task, ProjectMember, KanbanColumnKey } from "@/types/project";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { taskFormSchema } from "@/schemas/add-or-update-task-form.schema";
import { LoaderCircle, X } from "lucide-react";
import axios from "axios";
import { toast } from "sonner";
import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import { useParams } from "react-router";
import { useStore } from "../contexts/store-provider";

type TaskFormSchema = z.infer<typeof taskFormSchema>;

type Props = {
    members: ProjectMember[];
    initialData?: Task | null;
    onSuccess?: () => void;
    status?: KanbanColumnKey;
};

export default function AddOrUpdateTaskForm({
    members,
    initialData,
    onSuccess,
    status,
}: Props) {
    const { projectId } = useParams<{ projectId: string }>();
    const { setStore } = useStore();

    const form = useForm<TaskFormSchema>({
        resolver: zodResolver(taskFormSchema),
        defaultValues: {
            title: "",
            description: "",
            status: status || "todo",
            priority: "low",
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
                //
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
                        const assignedBy = prev.projectMembers[projectId!].find(
                            (member) =>
                                member._id === response.data.data.assignedBy,
                        );

                        const assignedTo = prev.projectMembers[projectId!].find(
                            (member) =>
                                member._id === response.data.data.assignedTo,
                        );

                        const newTask: Task = {
                            ...response.data.data,
                            assignedBy: assignedBy,
                            assignedTo: assignedTo,
                        };

                        return {
                            ...prev,
                            projectTasks: {
                                ...prev.projectTasks,
                                [projectId!]: {
                                    ...prev.projectTasks[projectId!],
                                    [values.status]: [
                                        ...prev.projectTasks[projectId!][
                                            values.status
                                        ],
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
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input {...field} />
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
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea {...field} rows={4} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select status" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values({
                                            todo: "todo",
                                            in_progress: "in_progress",
                                            done: "done",
                                        }).map((status) => (
                                            <SelectItem
                                                key={status}
                                                value={status}
                                            >
                                                {status.replace("_", " ")}
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
                                <FormLabel>Priority</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select priority" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {Object.values({
                                            low: "low",
                                            medium: "medium",
                                            high: "high",
                                        }).map((priority) => (
                                            <SelectItem
                                                key={priority}
                                                value={priority}
                                            >
                                                {priority}
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
                                <FormLabel>Assigned To</FormLabel>
                                <Select
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                >
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select user" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {members.map((member) => (
                                            <SelectItem
                                                key={member._id}
                                                value={member._id}
                                            >
                                                {member.user.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="files"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Attachments</FormLabel>
                                <FormControl>
                                    <Input
                                        type="file"
                                        multiple
                                        onChange={(e) =>
                                            field.onChange(e.target.files)
                                        }
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                {form.watch("files") &&
                    Array.from(form.watch("files") ?? []).map((file, idx) => (
                        <div
                            key={file.name}
                            className="flex items-center justify-between gap-2"
                        >
                            <p className="text-sm">{file.name}</p>
                            <button
                                type="button"
                                onClick={() => {
                                    const currentFiles = Array.from(
                                        form.watch("files") ?? [],
                                    );
                                    currentFiles.splice(idx, 1); // Remove by index
                                    form.setValue("files", currentFiles, {
                                        shouldValidate: true,
                                    });
                                }}
                                className="text-red-500 font-bold"
                            >
                                <X />
                            </button>
                        </div>
                    ))}
                <div className="flex">
                    <Button
                        disabled={form.formState.isSubmitting}
                        type="submit"
                    >
                        {form.formState.isSubmitting && (
                            <LoaderCircle className="animate-spin" />
                        )}
                        {initialData ? "Update" : "Create"}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
