import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
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
                    <ArrowUpDown className="size-4" />
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
        header: "Email",
        cell: ({ row }) => row.original.user.email,
    },
    {
        accessorKey: "role",
        header: "Role",
        cell: ({ row }) => (
            <span className="capitalize">{row.original.role}</span>
        ),
    },
    {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => {
            return <MemberTableAction row={row} />;
        },
    },
];
