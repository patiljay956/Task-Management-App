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
            <div className="flex items-center gap-2 text-blue-500 font-medium">
                Team Member
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-blue-500/10 hover:text-blue-600"
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
            <div className="flex items-center gap-2 text-blue-500 font-medium">
                Email Address
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-blue-500/10 hover:text-blue-600"
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
            <span className="text-muted-foreground">
                {row.original.user.email}
            </span>
        ),
    },
    {
        accessorKey: "role",
        header: ({ column }) => (
            <div className="flex items-center gap-2 text-blue-500 font-medium">
                Permission Role
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-blue-500/10 hover:text-blue-600"
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
            const role = row.original.role;
            let roleColor = "bg-blue-100 text-blue-700 border-blue-300";
            let roleIcon = "●";

            if (role === "project_admin") {
                roleColor =
                    "bg-red-100 text-red-700 border-red-300 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800";
                roleIcon = "●";
            } else if (role === "project_manager") {
                roleColor =
                    "bg-amber-100 text-amber-700 border-amber-300 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
                roleIcon = "●";
            }

            return (
                <div
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleColor} capitalize shadow-sm`}
                >
                    <span className="mr-1">{roleIcon}</span>
                    {role.replace("_", " ")}
                </div>
            );
        },
    },
    {
        id: "actions",
        header: () => (
            <div className="text-blue-500 font-medium text-right pr-4">
                Manage
            </div>
        ),
        enableSorting: false,
        cell: ({ row }) => {
            return <MemberTableAction row={row} />;
        },
    },
];
