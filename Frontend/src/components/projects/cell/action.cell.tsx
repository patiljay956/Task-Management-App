import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Project } from "@/types/project";
import type { Row } from "@tanstack/react-table";
import { Settings, SquarePen, Trash, Eye } from "lucide-react";
import ConfirmDialog from "@/components/dialogs/confirm-dialog";
import { toast } from "sonner";
import axios from "axios";
import { API_PROJECT_ENDPOINTS } from "@/api/endpoints";
import { Link } from "react-router";

import { useStore } from "@/components/contexts/store-provider";
import { AddOrUpdateProjectDialog } from "@/components/dialogs/add-or-update-project-dialog";

type Props = {
    row: Row<Project>;
};

export default function Action({ row }: Props) {
    const { setStore } = useStore();

    const handleDelete = async () => {
        try {
            const response = await API_PROJECT_ENDPOINTS.deleteProject(
                row.original._id,
            );

            if (response.data.statusCode === 200) {
                toast.success("Project removed successfully!");
                setStore((prev) => {
                    return {
                        ...prev,
                        projects: prev.projects.filter(
                            (project) => project._id !== row.original._id,
                        ),
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
                    className="h-8 w-8 p-0 hover:bg-indigo-500/10"
                >
                    <Settings size={16} className="text-indigo-600" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-indigo-500/20">
                <DropdownMenuLabel className="text-indigo-600">
                    Project Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-indigo-500/20" />
                <DropdownMenuItem asChild>
                    <Link
                        to={`/app/project/${row.original._id}/kanban`}
                        onClick={(e) => e.stopPropagation()}
                        className="flex items-center text-sm px-2 py-1.5 hover:bg-indigo-500/10 rounded-md cursor-pointer"
                    >
                        <Eye className="mr-2 text-indigo-600" size={16} />
                        View Project
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <AddOrUpdateProjectDialog initialData={row.original}>
                        <span
                            onClick={(e) => e.stopPropagation()}
                            className="flex w-full items-center text-sm px-2 py-1.5 hover:bg-indigo-500/10 rounded-md cursor-pointer"
                        >
                            <SquarePen
                                className="mr-2 text-indigo-600"
                                size={16}
                            />
                            Edit Project
                        </span>
                    </AddOrUpdateProjectDialog>
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-red-500/10 focus:bg-red-500/10 rounded-md px-0 py-0 mt-1">
                    <ConfirmDialog onAction={handleDelete} actionText="Delete">
                        <span
                            className="flex gap-2 items-center text-red-500 px-2 py-1.5 w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Trash size={16} />
                            Delete Project
                        </span>
                    </ConfirmDialog>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
