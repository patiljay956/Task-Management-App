export const TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";
export const USER_KEY = "user";

export function getAccessTokenFromLS(): string | null {
    return localStorage.getItem(TOKEN_KEY);
}

export function setAccessTokenToLS(token: string) {
    localStorage.setItem(TOKEN_KEY, token);
}

export function clearTokensFromLS() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
}

export function isAuthenticated(): boolean {
    return !!getAccessTokenFromLS();
}

export function setRefreshTokenToLS(token: string) {
    localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export function getRefreshTokenFromLS() {
    return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setUserToLS<T>(user: T) {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
}

export function getUserFromLS() {
    return JSON.parse(localStorage.getItem(USER_KEY) || "{}");
}

export function clearUserFromLS() {
    localStorage.removeItem(USER_KEY);
}
