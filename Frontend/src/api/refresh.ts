import {
    getRefreshTokenFromLS,
    setRefreshTokenToLS,
    setAccessTokenToLS,
} from "./auth";
import { API_USER_ENDPOINTS } from "./endpoints";

export async function refreshAccessToken(): Promise<string> {
    const refreshToken = getRefreshTokenFromLS();
    if (!refreshToken) throw new Error("No refresh token available");

    const response = await API_USER_ENDPOINTS.refreshAccessToken();

    const { accessToken, refreshToken: newRefreshToken } = response.data;

    // Save new tokens
    setAccessTokenToLS(accessToken);
    setRefreshTokenToLS(newRefreshToken);

    return accessToken;
}
