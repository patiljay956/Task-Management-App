import { type AxiosResponse } from "axios";
import api from "./axios";
import { z } from "zod";
declare module "axios" {
    interface AxiosRequestConfig {
        skipAuth?: boolean;
        skipRefresh?: boolean;
    }
}

export const API_USER_ENDPOINTS = {
    register: async function (params: {
        name: string;
        username: string;
        email: string;
        password: string;
    }): Promise<AxiosResponse> {
        return await api.post("/user/register", params, {
            skipAuth: true,
            skipRefresh: true,
        });
    },
    login: async function (params: {
        userNameOrEmail: string;
        password: string;
    }) {
        if (z.string().email().safeParse(params.userNameOrEmail).success) {
            console.log("email");
            return await api.post(
                "/user/login",
                {
                    email: z
                        .string()
                        .trim()
                        .email()
                        .parse(params.userNameOrEmail),
                    password: z.string().parse(params.password),
                },
                {
                    skipRefresh: true,
                },
            );
        } else {
            return await api.post(
                "/user/login",
                {
                    username: z.string().trim().parse(params.userNameOrEmail),
                    password: z.string().trim().parse(params.password),
                },
                {
                    skipRefresh: true,
                },
            );
        }
    },
    logout: async function (): Promise<AxiosResponse> {
        return await api.get("/user/logout");
    },
    verifyEmail: async function (token: string): Promise<AxiosResponse> {
        return await api.get("/user/verify-email", {
            params: {
                token,
                skipRefresh: true,
            },
        });
    },
    resendVerificationEmail: async function (params: {
        email: string;
    }): Promise<AxiosResponse> {
        return await api.post("/user/resend-verification-email", params);
    },
    forgotPasswordRequest: async function (params: { email: string }) {
        return await api.post("/user/forgot-password-request", params);
    },
    forgotPasswordReset: async function (params: {
        token: string;
        password: string;
    }) {
        return await api.post(
            "/user/reset-password",
            {
                password: params.password,
            },
            {
                params: {
                    token: params.token,
                },
            },
        );
    },
    refreshAccessToken: async function (): Promise<AxiosResponse> {
        return await api.get("/user/refresh-access-token");
    },
    profile: async function (): Promise<AxiosResponse> {
        return await api.get("/user/current-user");
    },
    changePassword: async function (params: {
        newPassword: string;
        password: string;
    }) {
        return await api.patch("/user/change-password", {
            newPassword: params.newPassword,
            password: params.password,
        });
    },
    updateAvatar: async function (file: File): Promise<AxiosResponse> {
        const formData = new FormData();
        formData.append("file", file);
        return await api.patch("user/user-details/update-avatar", formData, {
            headers: {
                "Content-Type": undefined, // automatically set by the browser for multipart/form-data
            },
        });
    },
};

export const API_PROJECT_ENDPOINTS = {
    getProjects: async function (): Promise<AxiosResponse> {
        return await api.get("/project");
    },
    getProjectById: async function (projectId: string): Promise<AxiosResponse> {
        return await api.get(`/project/${projectId}`);
    },
    addProject: async function (params: {
        name: string;
        description: string;
    }): Promise<AxiosResponse> {
        return await api.post("/project", params);
    },
    updateProject: async function name(params: {
        projectId: string;
        name: string;
        description: string;
    }) {
        return await api.patch(`/project/${params.projectId}`, {
            name: params.name,
            description: params.description,
        });
    },
    deleteProject: async function (projectId: string): Promise<AxiosResponse> {
        return await api.delete(`/project/${projectId}`);
    },
    getProjectMembers: async function (
        projectId: string,
    ): Promise<AxiosResponse> {
        return await api.get(`/project/${projectId}/member`);
    },
    inviteMember: async function (params: {
        projectId: string;
        email: string;
        role: string;
    }): Promise<AxiosResponse> {
        return await api.post(`/project/${params.projectId}/member/email`, {
            email: params.email,
            role: params.role,
        });
    },
    removeMember: async function (params: {
        projectId: string;
        memberId: string;
    }): Promise<AxiosResponse> {
        return await api.delete(
            `/project/${params.projectId}/member/${params.memberId}`,
        );
    },
    updateMemberRole: async function (params: {
        projectId: string;
        memberId: string;
        role: string;
    }): Promise<AxiosResponse> {
        return await api.patch(`/project/${params.projectId}/member`, {
            memberId: params.memberId,
            role: params.role,
        });
    },
    getProjectTasks: async function (
        projectId: string,
    ): Promise<AxiosResponse> {
        return await api.get(`/project/${projectId}/tasks`);
    },
    updateTaskStatusOrPriority: async function (params: {
        projectId: string;
        taskId: string;
        status: string;
        priority: string;
    }): Promise<AxiosResponse> {
        return await api.patch(
            `/project/${params.projectId}/tasks/${params.taskId}/status-or-priority`,
            {
                status: params.status,
                priority: params.priority,
            },
        );
    },
    addTask: async function (params: {
        projectId: string;
        title: string;
        description: string;
        assignedTo?: string;
        status: string;
        priority: string;
        files?: File[];
    }): Promise<AxiosResponse> {
        //create form data
        const formData = new FormData();
        if (params.files) {
            for (let i = 0; i < params.files.length; i++) {
                formData.append("attachments", params.files[i]);
            }
        }

        formData.append("title", params.title);
        formData.append("description", params.description);
        formData.append("assignedTo", params.assignedTo || "");
        formData.append("status", params.status);
        formData.append("priority", params.priority);

        return await api.post(`/project/${params.projectId}/tasks`, formData, {
            headers: {
                "Content-Type": undefined, // automatically set by the browser for multipart/form-data
            },
        });
    },
    updateTask: async function (params: {
        projectId: string;
        taskId: string;
        title: string;
        description: string;
        assignedTo?: string;
        status: string;
        priority: string;
        files?: File[];
    }): Promise<AxiosResponse> {
        //create form data
        const formData = new FormData();
        if (params.files) {
            for (let i = 0; i < params.files.length; i++) {
                formData.append("attachments", params.files[i]);
            }
        }

        formData.append("title", params.title);
        formData.append("description", params.description);
        formData.append("assignedTo", params.assignedTo || "");
        formData.append("status", params.status);
        formData.append("priority", params.priority);

        return await api.patch(
            `/project/${params.projectId}/tasks/${params.taskId}`,
            formData,
            {
                headers: {
                    "Content-Type": undefined, // automatically set by the browser for multipart/form-data
                },
            },
        );
    },
    deleteTask: async function (params: {
        projectId: string;
        taskId: string;
    }): Promise<AxiosResponse> {
        return await api.delete(
            `/project/${params.projectId}/tasks/${params.taskId}`,
        );
    },
};

export const API_TASK_ENDPOINTS = {
    getSubTasks: async function (params: {
        taskId: string;
        projectId: string;
    }): Promise<AxiosResponse> {
        return await api.get(
            `/subtask/p/${params.projectId}/t/${params.taskId}`,
        );
    },
    updateSubTask: async function (params: {
        taskId: string;
        projectId: string;
        subtaskId: string;
        title: string;
        isCompleted: boolean;
    }): Promise<AxiosResponse> {
        return await api.patch(
            `/subtask/p/${params.projectId}/t/${params.taskId}/st/${params.subtaskId}`,
            {
                title: params.title,
                isCompleted: params.isCompleted,
            },
        );
    },
    addSubTask: async function (params: {
        taskId: string;
        projectId: string;
        title: string;
    }): Promise<AxiosResponse> {
        return await api.post(
            `/subtask/p/${params.projectId}/t/${params.taskId}`,
            {
                title: params.title,
                isCompleted: false,
            },
        );
    },
    deleteSubTask: async function (params: {
        taskId: string;
        projectId: string;
        subtaskId: string;
    }): Promise<AxiosResponse> {
        return await api.delete(
            `/subtask/p/${params.projectId}/t/${params.taskId}/st/${params.subtaskId}`,
        );
    },
};
