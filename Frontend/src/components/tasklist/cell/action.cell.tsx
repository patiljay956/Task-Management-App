import AddOrUpdateTaskDialog from "@/components/dialogs/add-or-update-task-dialog";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Task } from "@/types/project";
import type { Row } from "@tanstack/react-table";
import { EllipsisVertical, SquarePen, Trash } from "lucide-react";
import ConfirmDialog from "@/components/dialogs/confirm-dialog";
import { toast } from "sonner";
import axios from "axios";
import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import { useParams } from "react-router";
import { useStore } from "@/components/contexts/store-provider";
import { useAuth } from "@/hooks/use-auth";

type Props = {
    row: Row<Task>;
};

export default function Action({ row }: Props) {
    const { projectId } = useParams<{ projectId: string }>();
    const { setStore } = useStore();
    const { user } = useAuth();

    const handleDelete = async () => {
        try {
            const response = await API_PROJECT_ENDPOINTS.deleteTask({
                taskId: row.original._id,
                projectId: projectId!,
            });

            if (response.data.statusCode === 200) {
                toast.success("Task removed successfully!");
                setStore((prev) => {
                    return {
                        ...prev,
                        projectTasks: {
                            ...prev.projectTasks,
                            [projectId!]: {
                                ...prev.projectTasks[projectId!],
                                [row.original.status]: prev.projectTasks[
                                    projectId!
                                ][row.original.status].filter(
                                    (task) => task._id !== row.original._id,
                                ),
                            },
                        },
                    };
                });
            }
        } catch (error) {
            if (axios.isAxiosError(error))
                toast.error(error.response?.data?.message);
            else toast.error("Something went wrong. Please try again.");
        }
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    disabled={row.original.assignedTo?.user._id === user?._id}
                >
                    <EllipsisVertical size={18} />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <AddOrUpdateTaskDialog initialData={row.original}>
                        <span
                            onClick={(e) => e.stopPropagation()}
                            className="flex w-full items-center text-sm px-2 py-1.5 hover:bg-muted rounded-md"
                        >
                            <SquarePen className="mr-2" size={16} />
                            Edit
                        </span>
                    </AddOrUpdateTaskDialog>
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="text-destructive focus:text-destructive focus:bg-destructive/10 dark:focus:bg-destructive/20
                "
                >
                    <ConfirmDialog onAction={handleDelete} actionText="Delete">
                        <span
                            className="flex gap-2 items-center"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Trash className="text-destructive" />
                            Delete
                        </span>
                    </ConfirmDialog>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
