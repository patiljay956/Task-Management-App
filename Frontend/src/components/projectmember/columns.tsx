import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import MemberTableAction from "./member-table-action";
import type { User } from "@/types/auth";
import type { ProjectRole } from "@/types/project";

type ProjectMemberRow = {
    user: User;
    role: ProjectRole;
};

export const columns: ColumnDef<ProjectMemberRow>[] = [
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
        cell: ({ row }) => row.original.user.name,
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
