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
};
