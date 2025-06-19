import { type ColumnDef } from "@tanstack/react-table";
import { type Project } from "@/types/project"; // or wherever your interface is
import { Link } from "react-router";
import DescriptionHover from "./description-hover";
import UserHover from "./user-hover";
import type { User } from "@/types/auth";
import Action from "./cell/action.cell";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "name",
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
            const name = row.original.name;
            return (
                <Link to={`/app/project/${row.original._id}/kanban`}>
                    {name}
                </Link>
            );
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        enableSorting: false,
        cell: ({ row }) => {
            return <DescriptionHover row={row} />;
        },
    },
    {
        accessorKey: "createdBy",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
                Owner
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
            const user = row.original.createdByUser as User;
            return <UserHover user={user}></UserHover>;
        },
    },
    {
        accessorKey: "createdAt",
        header: ({ column }) => (
            <div className="flex items-center gap-2">
                Created
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
            const value = row.getValue("createdAt") as string;
            return new Date(value).toLocaleDateString();
        },
    },
    {
        accessorKey: "actions",
        header: "Actions",
        enableSorting: false,
        cell: ({ row }) => {
            return <Action row={row} />;
        },
    },
];
