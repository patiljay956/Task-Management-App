import type { ColumnDef } from "@tanstack/react-table";
import type { Task } from "@/types/project";
import { PriorityCell } from "./cell/priority.cell";
import { AssignedToCell } from "./cell/assigned-to.cell";
import { TitleCell } from "./cell/title.cell";
import Action from "./cell/action.cell";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
                Title
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
        cell: ({ row }) => <TitleCell task={row.original} />,
    },
    {
        accessorKey: "priority",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
                Priority
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
            if (!row.original) return null;
            return <PriorityCell priority={row.original.priority} />;
        },
    },
    {
        accessorKey: "assignedTo",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
                Assigned To
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
        cell: ({ row }) =>
            row.original?.assignedTo ? (
                <AssignedToCell user={row.original.assignedTo.user} />
            ) : null,
    },
    {
        accessorKey: "status",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
                Status
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
            if (!row.original) return null;
            return <span className="capitalize">{row.original?.status}</span>;
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
            if (!row.original) return null;
            return <Action row={row} />;
        },
    },
];
