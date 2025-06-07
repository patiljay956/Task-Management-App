import { type AxiosInstance } from "axios";
import { clearTokensFromLS, getAccessTokenFromLS } from "./auth";
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
            if (config.skipAuth) {
                return config;
            }

            const token = getAccessTokenFromLS();
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

            // 👇 If the request opts out of refresh, just reject
            if (originalRequest?.skipRefresh) {
                return Promise.reject(error);
            }

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve, reject) => {
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
                    clearTokensFromLS();
                    return Promise.reject(err);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        },
    );
}
