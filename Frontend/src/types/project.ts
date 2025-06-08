import type { User } from "./auth";

export type Project = {
    _id: string;
    name: string;
    description: string;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
};

export type ProjectMember = {
    _id: string;
    user: User;
    project: Project;
    role: "project_admin" | "project_manager" | "member";
};
