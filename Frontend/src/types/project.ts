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
export type ProjectTasks = Record<KanbanColumnKey, Task[]>;

export type KanbanColumn = {
    title: string;
    key: KanbanColumnKey;
};

export type TaskStatusEnum = "todo" | "in_progress" | "done";
export type TaskPriorityEnum = "high" | "medium" | "low";
export type KanbanColumnKey = "todo" | "in_progress" | "done";

export type Task = {
    _id: string;
    title: string;
    description: string;
    status: TaskStatusEnum;
    priority: TaskPriorityEnum;
    assignedTo: ProjectMember | undefined;
    assignedBy: ProjectMember | undefined;
    createdAt: Date;
    updatedAt: Date;
    attachments: TaskFile[];
    project?: Project;
};

export type SubTask = {
    _id: string;
    title: string;
    task: Task;
    isCompleted: boolean;
    createdBy: User;
    createdAt: Date;
    updatedAt: Date;
};

export type TaskFile = {
    _id: string;
    public_id: string;
    url: string;
    name?: string;
    size?: number; // in bytes
    mimeType?: string;
};

export type Note = {
    _id: string;
    content: string;
    createdAt: string;
    createdBy: ProjectMember;
    project: Project;
};

// project summary types
export type TaskStat = {
    _id: "todo" | "done" | "in_progress";
    count: number;
};

export type TopProject = {
    _id: string;
    taskCount: number;
};

export type ProjectSummary = {
    totalProjects: number;
    AllTaskStats: TaskStat[];
    topFiveActiveProjects: TopProject[];
};

export type ProjectDetails = {
    _id: string;
    name: string;
    description: string;
    createdAt: string;
    memberCount: number;
    taskCount: number;
    completionRate: number;
};

// recent activity types
export type ActivityItem =
    | {
          type: "task";
          date: string;
          data: Task;
      }
    | {
          type: "note";
          date: string;
          data: Note;
      }
    | {
          type: "member";
          date: string;
          data: ProjectMember;
      };
