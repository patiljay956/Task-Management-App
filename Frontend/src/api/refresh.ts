import {
    getRefreshTokenFromLS,
    setRefreshTokenToLS,
    setAccessTokenToLS,
} from "./auth";
import { API_USER_ENDPOINTS } from "./endpoints";

export async function refreshAccessToken(): Promise<string> {
    const refreshToken = getRefreshTokenFromLS();
    if (!refreshToken) {
        // Redirect manually
        window.location.href = "/login"; // or use absolute path if needed
        throw new Error("No refresh token found");
    }

    const response = await API_USER_ENDPOINTS.refreshAccessToken();

    const { accessToken, newRefreshToken } = response.data.data;

    // Save new tokens
    setAccessTokenToLS(accessToken);
    setRefreshTokenToLS(newRefreshToken);

    return accessToken;
}
