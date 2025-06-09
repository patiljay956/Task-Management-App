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
    project?: Project;
    user: User;
    role: ProjectRole;
};

export type ProjectMembers = Record<string, ProjectMember[]>;

export type ProjectRole = "project_admin" | "project_manager" | "member";

export type KanbanColumn = {
    title: string;
    key: KanbanColumnKey;
};

export type TaskStatusEnum = "todo" | "inprogress" | "done";
export type TaskPriorityEnum = "high" | "medium" | "low";
export type KanbanColumnKey = "todo" | "inprogress" | "done";

export type Task = {
    _id: string;
    title: string;
    description: string;
    status: TaskStatusEnum;
    priority: TaskPriorityEnum;
    assignedTo: User;
    assignedBy: User;
    createdAt: Date;
    updatedAt: Date;
};
