import { type ColumnDef } from "@tanstack/react-table";
import { type Project } from "@/types/project"; // or wherever your interface is
import type { User } from "@/types/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "../ui/hover-card";
import { Link } from "react-router";

export const columns: ColumnDef<Project>[] = [
    {
        accessorKey: "name",
        header: "Name",
        cell: ({ row }) => {
            const name = row.original.name;
            return <Link to={`/app/project/${row.original._id}`}>{name}</Link>;
        },
    },
    {
        accessorKey: "description",
        header: "Description",
        cell: ({ row }) => {
            const description = row.original.description;
            return (
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <p className="line-clamp-1 cursor-pointer text-sm text-muted-foreground max-w-[200px] hover:underline">
                            {description}
                        </p>
                    </HoverCardTrigger>
                    <HoverCardContent className="max-w-sm p-3 text-sm leading-relaxed">
                        {description +
                            "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, "}
                    </HoverCardContent>
                </HoverCard>
            );
        },
    },
    {
        accessorKey: "createdBy",
        header: "Owner",
        cell: ({ row }) => {
            const owner = row.original.createdBy as User;

            return (
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <div className="inline-flex items-center gap-2 cursor-pointer hover:underline">
                            <Avatar className="h-6 w-6">
                                <AvatarImage
                                    src={owner?.avatar?.url}
                                    alt={owner.name}
                                />
                                <AvatarFallback>
                                    {owner.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                                {owner.name}
                            </span>
                        </div>
                    </HoverCardTrigger>
                    <HoverCardContent className="w-64 p-4 space-y-2">
                        <div className="flex items-center gap-3">
                            <Avatar className="h-10 w-10">
                                <AvatarImage
                                    src={owner?.avatar?.url}
                                    alt={owner.name}
                                />
                                <AvatarFallback>
                                    {owner.name
                                        ?.split(" ")
                                        .map((n) => n[0])
                                        .join("")
                                        .toUpperCase()}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-semibold text-sm">
                                    {owner.name}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    {owner.email}
                                </p>
                            </div>
                        </div>
                    </HoverCardContent>
                </HoverCard>
            );
        },
    },
    {
        accessorKey: "createdAt",
        header: "Created At",
        cell: ({ row }) => {
            const value = row.getValue("createdAt") as string;
            return new Date(value).toLocaleDateString();
        },
    },
    {
        accessorKey: "updatedAt",
        header: "Updated At",
        cell: ({ row }) => {
            const value = row.getValue("updatedAt") as string;
            return new Date(value).toLocaleDateString();
        },
    },
];
