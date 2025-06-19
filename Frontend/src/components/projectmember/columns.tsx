import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import MemberTableAction from "./member-table-action";
import type { ProjectMember } from "@/types/project";
import UserHover from "../projects/user-hover";

export const columns: ColumnDef<ProjectMember>[] = [
    {
        accessorKey: "user.name",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
                Name
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => column.toggleSorting()}
                >
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="size-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="size-4" />
                    ) : (
                        <ArrowUpDown className="size-4" />
                    )}
                </Button>
            </div>
        ),
        cell: ({ row }) => {
            const user = row.original.user;
            return <UserHover user={user}></UserHover>;
        },
    },
    {
        accessorKey: "user.email",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
                Email
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => column.toggleSorting()}
                >
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="size-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="size-4" />
                    ) : (
                        <ArrowUpDown className="size-4" />
                    )}
                </Button>
            </div>
        ),
        cell: ({ row }) => row.original.user.email,
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
                Role
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8"
                    onClick={() => column.toggleSorting()}
                >
                    {column.getIsSorted() === "asc" ? (
                        <ArrowUp className="size-4" />
                    ) : column.getIsSorted() === "desc" ? (
                        <ArrowDown className="size-4" />
                    ) : (
                        <ArrowUpDown className="size-4" />
                    )}
                </Button>
            </div>
        ),
        cell: ({ row }) => (
            <span className="capitalize">{row.original.role}</span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
            return <MemberTableAction row={row} />;
        },
    },
];
