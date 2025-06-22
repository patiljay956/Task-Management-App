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
            <div className="flex items-center gap-2 text-green-500 font-medium">
                Task Details
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-green-500/10 hover:text-green-600"
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
            <div className="flex items-center gap-2 text-green-500 font-medium">
                Priority
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-green-500/10 hover:text-green-600"
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
            <div className="flex items-center gap-2 text-green-500 font-medium">
                Assigned To
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-green-500/10 hover:text-green-600"
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
            <div className="flex items-center gap-2 text-green-500 font-medium">
                Status
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-green-500/10 hover:text-green-600"
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
            const statusColors = {
                todo: "bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200",
                in_progress:
                    "bg-yellow-200 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300",
                done: "bg-green-200 text-green-700 dark:bg-green-900/50 dark:text-green-300",
            };
            const status = row.original?.status || "todo";
            return (
                <span
                    className={`capitalize px-2 py-1 rounded-md text-xs font-medium ${statusColors[status]}`}
                >
                    {status === "in_progress" ? "in progress" : status}
                </span>
            );
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
