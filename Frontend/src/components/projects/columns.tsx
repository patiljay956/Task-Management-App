import { type ColumnDef } from "@tanstack/react-table";
import { type Project } from "@/types/project"; // or wherever your interface is
import { Link } from "react-router";
import DescriptionHover from "./description-hover";
import UserHover from "./user-hover";
import type { User } from "@/types/auth";
import Action from "./cell/action.cell";
import { Button } from "../ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, Folder } from "lucide-react";
import { Badge } from "../ui/badge";

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "name",
        header: ({ column }) => (
            <div className="flex items-center gap-2 text-indigo-500 font-medium">
                Project Name
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-indigo-500/10 hover:text-indigo-600"
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
                <Link
                    to={`/app/project/${row.original._id}/kanban`}
                    className="flex items-center gap-2 group"
                >
                    <div className="p-1.5 rounded-md bg-indigo-500/10 text-indigo-600 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                        <Folder size={16} />
                    </div>
                    <div className="font-medium group-hover:text-indigo-600 transition-colors">
                        {name}
                    </div>
                    <Badge
                        variant="outline"
                        className="bg-indigo-500/5 text-xs border-indigo-500/20 text-indigo-700 dark:text-indigo-400"
                    >
                        Active
                    </Badge>
                </Link>
            );
        },
    },
    {
        accessorKey: "description",
        header: () => (
            <div className="flex items-center gap-2 text-indigo-500 font-medium">
                Description
            </div>
        ),
        enableSorting: false,
        cell: ({ row }) => {
            return <DescriptionHover row={row} />;
        },
    },
    {
        accessorKey: "createdBy",
        header: ({ column }) => (
            <div className="flex items-center gap-2 text-indigo-500 font-medium">
                Project Owner
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-indigo-500/10 hover:text-indigo-600"
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
            <div className="flex items-center gap-2 text-indigo-500 font-medium">
                Created Date
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 hover:bg-indigo-500/10 hover:text-indigo-600"
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
            const date = new Date(value);

            // Calculate if the project is recent (created in the last 7 days)
            const isRecent =
                Date.now() - date.getTime() < 7 * 24 * 60 * 60 * 1000;

            return (
                <div className="flex items-center gap-2">
                    <span
                        className={`${
                            isRecent
                                ? "text-indigo-600 font-medium"
                                : "text-muted-foreground"
                        }`}
                    >
                        {date.toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                    {isRecent && (
                        <Badge className="bg-indigo-500/10 text-indigo-600 border-indigo-500/20 text-xs">
                            New
                        </Badge>
                    )}
                </div>
            );
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
