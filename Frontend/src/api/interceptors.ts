import { type AxiosInstance } from "axios";
import { clearToken, getToken } from "./auth";
import { refreshAccessToken } from "./refresh";

let isRefreshing = false;
let failedQueue: any[] = [];

function processQueue(error: any, token: string | null = null) {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
}

export function attachAuthTokenInterceptor(api: AxiosInstance) {
    api.interceptors.request.use(
        (config) => {
            const token = getToken();
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error) => Promise.reject(error),
    );

    api.interceptors.response.use(
        (response) => response,
        async (error) => {
            const originalRequest = error.config;

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise(function (resolve, reject) {
                        failedQueue.push({ resolve, reject });
                    })
                        .then((token) => {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                            return api(originalRequest);
                        })
                        .catch((err) => Promise.reject(err));
                }

                isRefreshing = true;
                originalRequest._retry = true;

                try {
                    const newToken = await refreshAccessToken();
                    processQueue(null, newToken);
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                } catch (err) {
                    processQueue(err, null);
                    clearToken();
                    window.location.href = "/login"; // or show toast and redirect
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }
        },
    );
}
