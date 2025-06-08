import type { User } from "./auth";

export type Project = {
    _id: string;
    name: string;
    description: string;
    createdByUser: User;
    createdAt: Date;
    updatedAt: Date;
};
export type ProjectMembers = {
    [projectId: string]: {
        user: User;
        role: ProjectRole;
    }[];
};

export type ProjectRole = "project_admin" | "project_manager" | "member";
