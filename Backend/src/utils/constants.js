export const UserRolesEnum = {
    ADMIN: "project_admin",
    PROJECT_MANAGER: "project_manager",
    MEMBER: "member",
};
export const AvailableUserRoles = Object.values(UserRolesEnum);

export const TaskStatusEnum = {
    TODO: "todo",
    IN_PROGRESS: "in_progress",
    DONE: "done",
};

export const AvailableTaskStatuses = Object.values(TaskStatusEnum);

export const TaskPriorityEnum = {
    LOW: "low",
    MEDIUM: "medium",
    HIGH: "high",
};

export const AvailableTaskPriority = Object.values(TaskPriorityEnum);
