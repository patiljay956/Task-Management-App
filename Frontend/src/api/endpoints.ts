import { type AxiosResponse } from "axios";
import api from "./axios";
import { z } from "zod";

export const API_USER_ENDPOINTS = {
    register: async function (params: {
        name: string;
        username: string;
        email: string;
        password: string;
    }): Promise<AxiosResponse> {
        return await api.post("/user/register", params);
    },
    login: async function (params: {
        userNameOrEmail: string;
        password: string;
    }) {
        if (z.string().email().safeParse(params.userNameOrEmail).success) {
            return await api.post("/user/login", {
                email: z.string().email().parse(params.userNameOrEmail),
                password: z.string().parse(params.password),
            });
        } else if (z.string().safeParse(params.userNameOrEmail).success) {
            return await api.post("/user/login", {
                username: z.string().parse(params.userNameOrEmail),
                password: z.string().parse(params.password),
            });
        }
    },
    logout: async function (): Promise<AxiosResponse> {
        return await api.get("/user/logout");
    },
    verifyEmail: async function (token: string): Promise<AxiosResponse> {
        return await api.get("/user/verify-email", {
            params: {
                token,
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
            "/user/forgot-password-reset",
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
