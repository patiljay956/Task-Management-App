import type { ProjectMember } from "@/types/project";
import type { ColumnDef } from "@tanstack/react-table";
import { Button } from "../ui/button";
import { ArrowUpDown } from "lucide-react";
import MemberTableAction from "./member-table-action";

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
            return <MemberTableAction row={row}></MemberTableAction>;
        },
    },
];
