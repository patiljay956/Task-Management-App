import type { ColumnDef } from "@tanstack/react-table";
import type { Task } from "@/types/project";
import { PriorityCell } from "./cell/priority.cell";
import { AssignedToCell } from "./cell/assigned-to.cell";
import { TitleCell } from "./cell/title.cell";
import Action from "./cell/action.cell";

export const columns: ColumnDef<Task>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => <TitleCell task={row.original} />,
    },
    {
        accessorKey: "priority",
        header: "Priority",
        cell: ({ row }) => <PriorityCell priority={row.original.priority} />,
    },
    {
        accessorKey: "assignedTo",
        header: "Assigned To",
        cell: ({ row }) =>
            row.original.assignedTo?.user ? (
                <AssignedToCell user={row.original.assignedTo.user} />
            ) : (
                <span>Unassigned</span>
            ),
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <span className="capitalize">{row.original.status}</span>
        ),
    },
    {
        accessorKey: "actions",
        header: "Actions",
        cell: ({ row }) => <Action row={row} />,
    },
];
