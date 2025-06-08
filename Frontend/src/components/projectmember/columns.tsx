import type { ProjectMember } from "@/types/project";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from "../ui/dropdown-menu";

export const columns: ColumnDef<ProjectMember>[] = [
    {
        accessorKey: "user.name",
        header: ({ column }) => (
            <>
                Name
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => column.toggleSorting()}
                >
                    <ArrowUpDown />
                </Button>
            </>
        ),
        cell: ({ row }) => row.original.user.name,
    },
    {
        accessorKey: "user.email",
        header: "Email",
        cell: ({ row }) => row.original.user.email,
    },
    {
        accessorKey: "project.name",
        header: "Project",
        cell: ({ row }) => row.original.project.name,
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => row.original.role,
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>

                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                            onClick={() =>
                                alert(`Viewing ${row.original.user.name}`)
                            }
                        >
                            View
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                alert(`Editing ${row.original.user.name}`)
                            }
                        >
                            Edit Role
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() =>
                                alert(`Removing ${row.original.user.name}`)
                            }
                        >
                            Remove
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];
