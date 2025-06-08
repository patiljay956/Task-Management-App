import type { User } from "./auth";

export type Project = {
    _id: string;
    name: string;
    description: string;
    createdByUser: User;
    createdAt: Date;
    updatedAt: Date;
};

export type ProjectMember = {
    _id: string;
    user: User;
    project: Project;
    role: ProjectRole;
};

export type ProjectRole = "project_admin" | "project_manager" | "member";
