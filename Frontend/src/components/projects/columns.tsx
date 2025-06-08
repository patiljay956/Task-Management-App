import { type ColumnDef } from "@tanstack/react-table";
import { type Project } from "@/types/project"; // or wherever your interface is
import { Link } from "react-router";
import DescriptionHover from "./description-hover";
import UserHover from "./user-hover";
import type { User } from "@/types/auth";

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
            return <DescriptionHover row={row} />;
        },
    },
    {
        accessorKey: "createdBy",
        header: "Owner",
        cell: ({ row }) => {
            const user = row.original.createdByUser as User;
            return <UserHover user={user}></UserHover>;
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
