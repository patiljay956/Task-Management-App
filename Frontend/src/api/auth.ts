export const TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user";

export function getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getToken();
}

export function setRefreshToken(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getRefreshToken() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setUser<T>(user: T) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUser() {
    return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
}

export function clearUser() {
    localStorage.removeItem(USER_KEY);
}
